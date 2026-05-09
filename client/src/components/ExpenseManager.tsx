import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useExpense, Expense } from '@/contexts/ExpenseContext';
import { toast } from 'sonner';

interface ExpenseManagerProps {
  matterId: string;
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpenseManager({ matterId, clientId, isOpen, onClose }: ExpenseManagerProps) {
  const { expenses, addExpense, updateExpense, deleteExpense, getExpensesByMatter } = useExpense();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    description: string;
    amount: number;
    category: 'court-fees' | 'filing-fees' | 'expert-fees' | 'travel' | 'disbursements' | 'other';
    date: string;
    taxable: boolean;
    notes: string;
  }>({
    description: '',
    amount: 0,
    category: 'disbursements',
    date: new Date().toISOString().split('T')[0],
    taxable: false,
    notes: ''
  });

  const matterExpenses = useMemo(() => {
    return getExpensesByMatter(matterId);
  }, [matterId, expenses]);

  const totalExpenses = useMemo(() => {
    const subtotal = matterExpenses.reduce((sum, e) => sum + e.amount, 0);
    const hst = matterExpenses.filter(e => e.taxable).reduce((sum, e) => sum + e.amount, 0) * 0.13;
    return { subtotal, hst, total: subtotal + hst };
  }, [matterExpenses]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      description: '',
      amount: 0,
      category: 'disbursements',
      date: new Date().toISOString().split('T')[0],
      taxable: false,
      notes: ''
    });
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.toISOString().split('T')[0],
      taxable: expense.taxable,
      notes: expense.notes || ''
    });
  };

  const handleSave = () => {
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (formData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (editingId) {
      updateExpense(editingId, {
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        date: new Date(formData.date),
        taxable: formData.taxable,
        notes: formData.notes
      });
      toast.success('Expense updated');
      setEditingId(null);
    } else {
      addExpense({
        matterId,
        clientId,
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        date: new Date(formData.date),
        taxable: formData.taxable,
        notes: formData.notes
      });
      toast.success('Expense added');
      setIsAddingNew(false);
    }

    setFormData({
      description: '',
      amount: 0,
      category: 'disbursements',
      date: new Date().toISOString().split('T')[0],
      taxable: false,
      notes: ''
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this expense?')) {
      deleteExpense(id);
      toast.success('Expense deleted');
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'court-fees': 'Court Fees',
      'filing-fees': 'Filing Fees',
      'expert-fees': 'Expert Fees',
      'travel': 'Travel',
      'disbursements': 'Disbursements',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Manage Expenses
          </DialogTitle>
          <DialogDescription>
            Track expenses and disbursements for this matter
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? 'Edit Expense' : 'Add New Expense'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Court filing fee"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="mt-1"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value: 'court-fees' | 'filing-fees' | 'expert-fees' | 'travel' | 'disbursements' | 'other') => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="court-fees">Court Fees</SelectItem>
                        <SelectItem value="filing-fees">Filing Fees</SelectItem>
                        <SelectItem value="expert-fees">Expert Fees</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="disbursements">Disbursements</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="taxable"
                        checked={formData.taxable}
                        onCheckedChange={(checked) => setFormData({ ...formData, taxable: checked as boolean })}
                      />
                      <Label htmlFor="taxable" className="font-normal cursor-pointer">
                        Taxable (HST applies)
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional details..."
                    rows={2}
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

          {/* Expenses List */}
          <div className="space-y-2">
            {matterExpenses.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No expenses yet. Add one to get started.</p>
              </div>
            ) : (
              matterExpenses.map(expense => (
                <Card key={expense.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{expense.description}</h3>
                          <Badge variant="outline">{getCategoryLabel(expense.category)}</Badge>
                          {expense.taxable && (
                            <Badge className="bg-amber-100 text-amber-800">HST</Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>Amount: <span className="font-semibold">${expense.amount.toFixed(2)}</span></p>
                          <p>Date: {expense.date.toLocaleDateString()}</p>
                          {expense.notes && <p>Notes: {expense.notes}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(expense)}
                          className="gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(expense.id)}
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

          {/* Summary */}
          {matterExpenses.length > 0 && (
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${totalExpenses.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HST (13%):</span>
                    <span className="font-semibold">${totalExpenses.hst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total:</span>
                    <span>${totalExpenses.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Button */}
          {!isAddingNew && !editingId && (
            <Button onClick={handleAddNew} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
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
