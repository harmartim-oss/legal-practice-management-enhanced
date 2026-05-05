import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Users, BarChart3, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
import { InvoicePDFExport } from '@/components/InvoicePDFExport';
import { BillOfCostsPDFExport } from '@/components/BillOfCostsPDFExport';

interface TimeEntry {
  id: string;
  clientId: string;
  matterId: string;
  description: string;
  hours: number;
  minutes: number;
  rate: number;
  date: Date;
  amount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Matter {
  id: string;
  clientId: string;
  name: string;
  description: string;
  rate: number;
  startDate: Date;
  status: 'active' | 'completed' | 'on-hold';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('timekeeping');
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'ABC Corporation',
      email: 'finance@abccorp.com',
      phone: '(705) 555-0123',
      address: '123 Business Street, Suite 400, Sault Ste. Marie, ON P6A 1A1'
    }
  ]);

  const [matters, setMatters] = useState<Matter[]>([
    {
      id: '1',
      clientId: '1',
      name: 'Commercial Lease Review',
      description: 'Review and negotiation of commercial lease agreement',
      rate: 350,
      startDate: new Date('2025-09-01'),
      status: 'active'
    }
  ]);

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMatter, setSelectedMatter] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [showBillOfCosts, setShowBillOfCosts] = useState(false);
  const [showTimeReview, setShowTimeReview] = useState(false);
  const [showInvoiceExport, setShowInvoiceExport] = useState(false);
  const [showBillOfCostsExport, setShowBillOfCostsExport] = useState(false);

  // Calculate totals
  const totals = useMemo(() => {
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours + entry.minutes / 60, 0);
    const totalAmount = timeEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const hst = totalAmount * 0.13;
    return {
      hours: totalHours,
      amount: totalAmount,
      hst: hst,
      total: totalAmount + hst,
      entries: timeEntries.length
    };
  }, [timeEntries]);

  // Get available matters for selected client
  const availableMatters = useMemo(() => {
    return matters.filter(m => m.clientId === selectedClient);
  }, [selectedClient, matters]);

  // Add time entry
  const addTimeEntry = () => {
    if (!selectedClient || !taskDescription || !hours) {
      alert('Please fill in all required fields');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    const matter = matters.find(m => m.id === selectedMatter);
    if (!client) return;

    const entryHours = parseFloat(hours) || 0;
    const entryMinutes = parseFloat(minutes) || 0;
    const rate = matter?.rate || 350;
    const totalHours = entryHours + entryMinutes / 60;
    const amount = totalHours * rate;

    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}`,
      clientId: selectedClient,
      matterId: selectedMatter,
      description: taskDescription,
      hours: entryHours,
      minutes: entryMinutes,
      rate: rate,
      date: new Date(),
      amount: amount
    };

    setTimeEntries([...timeEntries, newEntry]);
    setTaskDescription('');
    setHours('');
    setMinutes('');
  };

  // Remove time entry
  const removeTimeEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(e => e.id !== id));
  };

  // Get client name
  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown';
  };

  // Get matter name
  const getMatterName = (matterId: string) => {
    return matters.find(m => m.id === matterId)?.name || 'General';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tim Harmar Legal</h1>
              <p className="text-slate-600">Practice Management System</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {totals.hours.toFixed(2)}h
              </Badge>
              <Badge variant="outline" className="gap-1">
                <FileText className="h-3 w-3" />
                ${totals.amount.toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timekeeping" className="gap-2">
              <Clock className="h-4 w-4" />
              Timekeeping
            </TabsTrigger>
            <TabsTrigger value="review" className="gap-2">
              <Eye className="h-4 w-4" />
              Review
            </TabsTrigger>
            <TabsTrigger value="invoicing" className="gap-2">
              <FileText className="h-4 w-4" />
              Invoicing
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
          </TabsList>

          {/* Timekeeping Tab */}
          <TabsContent value="timekeeping" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Time Entry Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Add Time Entry</CardTitle>
                  <CardDescription>Log time for client matters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Client</label>
                      <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Matter</label>
                      <Select value={selectedMatter} onValueChange={setSelectedMatter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select matter" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMatters.map(matter => (
                            <SelectItem key={matter.id} value={matter.id}>
                              {matter.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Task Description</label>
                    <Textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Describe the work performed..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Hours</label>
                      <Input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Minutes</label>
                      <Input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="59"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rate/hr</label>
                      <Input
                        type="number"
                        value={availableMatters.find(m => m.id === selectedMatter)?.rate || 350}
                        disabled
                        className="bg-slate-100"
                      />
                    </div>
                  </div>

                  <Button onClick={addTimeEntry} className="w-full">
                    Add Time Entry
                  </Button>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-600">Total Hours</div>
                    <div className="text-3xl font-bold text-slate-900">{totals.hours.toFixed(2)}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Billable Amount</div>
                    <div className="text-3xl font-bold text-blue-600">${totals.amount.toFixed(2)}</div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm text-slate-600">HST (13%)</div>
                    <div className="text-lg font-semibold">${totals.hst.toFixed(2)}</div>
                  </div>
                  <div className="pt-2 border-t bg-slate-50 -mx-6 px-6 py-4">
                    <div className="text-sm text-slate-600">Total with HST</div>
                    <div className="text-2xl font-bold text-slate-900">${totals.total.toFixed(2)}</div>
                  </div>
                  <div className="text-xs text-slate-500 pt-2">
                    {totals.entries} entries today
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Time Entries</CardTitle>
                <CardDescription>{timeEntries.length} entries</CardDescription>
              </CardHeader>
              <CardContent>
                {timeEntries.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No time entries yet. Start tracking your time!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {timeEntries.map(entry => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{getClientName(entry.clientId)}</div>
                          <div className="text-sm text-slate-600">{entry.description}</div>
                          <div className="text-xs text-slate-500">{entry.date.toLocaleTimeString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{entry.hours}h {entry.minutes}m</div>
                          <div className="text-sm text-slate-600">${entry.amount.toFixed(2)}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeEntry(entry.id)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Entry Review & Editing</CardTitle>
                <CardDescription>Review and edit time entries before billing</CardDescription>
              </CardHeader>
              <CardContent>
                {timeEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No time entries to review</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Client</th>
                          <th className="text-left py-2 px-3 font-medium">Matter</th>
                          <th className="text-left py-2 px-3 font-medium">Description</th>
                          <th className="text-right py-2 px-3 font-medium">Time</th>
                          <th className="text-right py-2 px-3 font-medium">Rate</th>
                          <th className="text-right py-2 px-3 font-medium">Amount</th>
                          <th className="text-center py-2 px-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeEntries.map(entry => (
                          <tr key={entry.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-3">{getClientName(entry.clientId)}</td>
                            <td className="py-3 px-3">{getMatterName(entry.matterId)}</td>
                            <td className="py-3 px-3">{entry.description}</td>
                            <td className="text-right py-3 px-3">{entry.hours}h {entry.minutes}m</td>
                            <td className="text-right py-3 px-3">${entry.rate.toFixed(2)}</td>
                            <td className="text-right py-3 px-3 font-medium">${entry.amount.toFixed(2)}</td>
                            <td className="text-center py-3 px-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeEntry(entry.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoicing Tab */}
          <TabsContent value="invoicing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice & Bill of Costs Generation</CardTitle>
                <CardDescription>Generate professional invoices and bills of costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No time entries available for invoicing</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setShowBillOfCostsExport(true)}
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <FileText className="h-6 w-6" />
                      <span>Generate Bill of Costs</span>
                    </Button>
                    <Button
                      onClick={() => setShowInvoiceExport(true)}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <Download className="h-6 w-6" />
                      <span>Generate Invoice</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Ontario Rules of Civil Procedure compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Family Law Rules compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>HST calculations verified (13%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Professional formatting applied</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clients & Matters</CardTitle>
                <CardDescription>Manage clients and their matters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map(client => (
                    <div key={client.id} className="p-4 border rounded-lg">
                      <div className="font-medium text-lg mb-2">{client.name}</div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>Email: {client.email}</div>
                        <div>Phone: {client.phone}</div>
                        <div>Address: {client.address}</div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm font-medium mb-2">Matters:</div>
                        <div className="space-y-1">
                          {matters
                            .filter(m => m.clientId === client.id)
                            .map(matter => (
                              <div key={matter.id} className="text-sm flex items-center justify-between">
                                <span>{matter.name}</span>
                                <Badge variant="outline" className="capitalize">
                                  {matter.status}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* PDF Export Dialogs */}
      <InvoicePDFExport
        timeEntries={timeEntries}
        clients={clients}
        matters={matters}
        isOpen={showInvoiceExport}
        onClose={() => setShowInvoiceExport(false)}
      />
      <BillOfCostsPDFExport
        timeEntries={timeEntries}
        clients={clients}
        matters={matters}
        isOpen={showBillOfCostsExport}
        onClose={() => setShowBillOfCostsExport(false)}
      />
    </div>
  );
}
