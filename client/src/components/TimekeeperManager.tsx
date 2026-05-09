import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useTimekeeper, Timekeeper } from '@/contexts/TimekeeperContext';
import { toast } from 'sonner';

interface TimekeeperManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimekeeperManager({ isOpen, onClose }: TimekeeperManagerProps) {
  const { timekeepers, addTimekeeper, updateTimekeeper, deleteTimekeeper } = useTimekeeper();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: 'lawyer' | 'paralegal' | 'legal-assistant' | 'articling-student' | 'other';
    hourlyRate: number;
    email: string;
    licenseNumber: string;
    active: boolean;
  }>({
    name: '',
    role: 'lawyer',
    hourlyRate: 350,
    email: '',
    licenseNumber: '',
    active: true
  });

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      name: '',
      role: 'lawyer',
      hourlyRate: 350,
      email: '',
      licenseNumber: '',
      active: true
    });
  };

  const handleEdit = (timekeeper: Timekeeper) => {
    setEditingId(timekeeper.id);
    setFormData({
      name: timekeeper.name,
      role: timekeeper.role,
      hourlyRate: timekeeper.hourlyRate,
      email: timekeeper.email || '',
      licenseNumber: timekeeper.licenseNumber || '',
      active: timekeeper.active
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (formData.hourlyRate <= 0) {
      toast.error('Hourly rate must be greater than 0');
      return;
    }

    if (editingId) {
      updateTimekeeper(editingId, formData);
      toast.success('Timekeeper updated');
      setEditingId(null);
    } else {
      addTimekeeper(formData);
      toast.success('Timekeeper added');
      setIsAddingNew(false);
    }

    setFormData({
      name: '',
      role: 'lawyer',
      hourlyRate: 350,
      email: '',
      licenseNumber: '',
      active: true
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      name: '',
      role: 'lawyer',
      hourlyRate: 350,
      email: '',
      licenseNumber: '',
      active: true
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this timekeeper?')) {
      deleteTimekeeper(id);
      toast.success('Timekeeper deleted');
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      lawyer: 'Lawyer',
      paralegal: 'Paralegal',
      'legal-assistant': 'Legal Assistant',
      'articling-student': 'Articling Student',
      other: 'Other'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      lawyer: 'bg-blue-100 text-blue-800',
      paralegal: 'bg-purple-100 text-purple-800',
      'legal-assistant': 'bg-green-100 text-green-800',
      'articling-student': 'bg-amber-100 text-amber-800',
      other: 'bg-slate-100 text-slate-800'
    };
    return colors[role] || 'bg-slate-100 text-slate-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Timekeepers
          </DialogTitle>
          <DialogDescription>
            Create and manage timekeepers (lawyers, paralegals, etc.) with their hourly rates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? 'Edit Timekeeper' : 'Add New Timekeeper'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., John Smith"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value: 'lawyer' | 'paralegal' | 'legal-assistant' | 'articling-student' | 'other') => setFormData({ ...formData, role: value })}>
                      <SelectTrigger id="role" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lawyer">Lawyer</SelectItem>
                        <SelectItem value="paralegal">Paralegal</SelectItem>
                        <SelectItem value="legal-assistant">Legal Assistant</SelectItem>
                        <SelectItem value="articling-student">Articling Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                    <Input
                      id="hourly-rate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                      placeholder="350"
                      className="mt-1"
                      min="0"
                      step="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="license">License Number (Optional)</Label>
                  <Input
                    id="license"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="e.g., LSO 12345"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timekeepers List */}
          <div className="space-y-2">
            {timekeepers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No timekeepers yet. Add one to get started.</p>
              </div>
            ) : (
              timekeepers.map(timekeeper => (
                <Card key={timekeeper.id} className={!timekeeper.active ? 'opacity-50' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{timekeeper.name}</h3>
                          <Badge className={getRoleColor(timekeeper.role)}>
                            {getRoleLabel(timekeeper.role)}
                          </Badge>
                          {!timekeeper.active && (
                            <Badge variant="outline" className="bg-slate-100">Inactive</Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>Hourly Rate: <span className="font-semibold">${timekeeper.hourlyRate.toFixed(2)}</span></p>
                          {timekeeper.email && <p>Email: {timekeeper.email}</p>}
                          {timekeeper.licenseNumber && <p>License: {timekeeper.licenseNumber}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(timekeeper)}
                          className="gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(timekeeper.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Add Button */}
          {!isAddingNew && !editingId && (
            <Button onClick={handleAddNew} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Timekeeper
            </Button>
          )}
        </div>

        <div className="flex gap-2 justify-end border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
