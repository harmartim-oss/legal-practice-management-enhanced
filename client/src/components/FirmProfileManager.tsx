import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, Building2, Check, AlertCircle, X } from 'lucide-react';
import { useFirmProfile, FirmProfile } from '@/contexts/FirmContext';
import { toast } from 'sonner';

interface FirmProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FirmProfileManager({ isOpen, onClose }: FirmProfileManagerProps) {
  const { firmProfile, createFirmProfile, updateFirmProfile } = useFirmProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Omit<FirmProfile, 'id' | 'createdAt' | 'updatedAt'>>({
    firmName: firmProfile?.firmName || '',
    lawyerName: firmProfile?.lawyerName || '',
    email: firmProfile?.email || '',
    phone: firmProfile?.phone || '',
    address: firmProfile?.address || '',
    city: firmProfile?.city || '',
    province: firmProfile?.province || 'ON',
    postalCode: firmProfile?.postalCode || '',
    website: firmProfile?.website || '',
    licenseNumber: firmProfile?.licenseNumber || '',
    logoUrl: firmProfile?.logoUrl || '',
    logoBase64: firmProfile?.logoBase64 || ''
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(
    firmProfile?.logoBase64 || firmProfile?.logoUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setFormData({
        ...formData,
        logoBase64: base64String,
        logoUrl: ''
      });
      setLogoPreview(base64String);
      toast.success('Logo uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firmName || !formData.lawyerName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (firmProfile?.id) {
        updateFirmProfile({
          ...firmProfile,
          ...formData
        });
        toast.success('Firm profile updated successfully');
      } else {
        createFirmProfile(formData);
        toast.success('Firm profile created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save firm profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearLogo = () => {
    setFormData({
      ...formData,
      logoBase64: '',
      logoUrl: ''
    });
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {firmProfile ? 'Edit Firm Profile' : 'Create Firm Profile'}
          </DialogTitle>
          <DialogDescription>
            Set up your law firm details that will appear on all invoices and bills of costs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Logo Section */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Firm Logo</div>
            <div className="flex gap-4">
              {/* Logo Preview */}
              <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
                {logoPreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      onClick={handleClearLogo}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs text-slate-500">No logo</div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1 flex flex-col justify-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-slate-500">
                  PNG, JPG or GIF (max. 2MB)
                </p>
                <p className="text-xs text-slate-500">
                  Recommended: Square format (500x500px)
                </p>
              </div>
            </div>
          </div>

          {/* Firm Information */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Firm Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Firm Name *</label>
                <Input
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleInputChange}
                  placeholder="e.g., Smith & Associates"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Lawyer Name *</label>
                <Input
                  name="lawyerName"
                  value={formData.lawyerName}
                  onChange={handleInputChange}
                  placeholder="e.g., John Smith"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Contact Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="info@firm.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone *</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(705) 555-0100"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Address</div>
            <div>
              <label className="text-sm font-medium mb-2 block">Street Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, Suite 100"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Sault Ste. Marie"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Province</label>
                <Input
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  placeholder="ON"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Postal Code</label>
                <Input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="P6A 1A1"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Additional Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Website</label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.firm.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Law Society License #</label>
                <Input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="LSO License Number"
                />
              </div>
            </div>
          </div>

          {/* Compliance Note */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <div className="font-medium">Your firm information will be used on:</div>
              <ul className="text-xs mt-1 space-y-1">
                <li>✓ All invoices and bills of costs</li>
                <li>✓ Professional cover letters</li>
                <li>✓ Client communications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {firmProfile ? 'Update Profile' : 'Create Profile'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
