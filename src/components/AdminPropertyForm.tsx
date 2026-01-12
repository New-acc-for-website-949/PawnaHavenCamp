import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  Star,
  MapPin,
  IndianRupee,
  Users,
  Clock,
  Phone
} from 'lucide-react';

interface AdminPropertyFormProps {
  property?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminPropertyForm = ({ property, onSuccess, onCancel }: AdminPropertyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'camping',
    location: '',
    map_link: '',
    rating: '4.5',
    price: '',
    price_note: 'per person with meal',
    capacity: '4',
    check_in_time: '2:00 PM',
    check_out_time: '11:00 AM',
    status: 'Verified',
    is_top_selling: false,
    is_active: true,
    is_available: true,
    contact: '+91 8806092609',
    owner_mobile: '',
    amenities: [''],
    activities: [''],
    highlights: [''],
    policies: [''],
    images: [''],
  });
  const { toast } = useToast();

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        category: property.category || 'camping',
        location: property.location || '',
        map_link: property.map_link || '',
        rating: property.rating?.toString() || '4.5',
        price: property.price || '',
        price_note: property.price_note || 'per person with meal',
        capacity: property.capacity?.toString() || '4',
        check_in_time: property.check_in_time || '2:00 PM',
        check_out_time: property.check_out_time || '11:00 AM',
        status: property.status || 'Verified',
        is_top_selling: property.is_top_selling ?? false,
        is_active: property.is_active ?? true,
        is_available: property.is_available ?? true,
        contact: property.contact || '+91 8806092609',
        owner_mobile: property.owner_mobile || '',
        amenities: property.amenities?.length ? property.amenities : [''],
        activities: property.activities?.length ? property.activities : [''],
        highlights: property.highlights?.length ? property.highlights : [''],
        policies: property.policies?.length ? property.policies : [''],
        images: property.images?.length ? property.images.map((img: any) => typeof img === 'string' ? img : img.image_url) : [''],
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('adminToken');
    const url = property 
      ? `/api/properties/${property.id}` 
      : '/api/properties';
    const method = property ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      rating: parseFloat(formData.rating) || 4.5,
      capacity: parseInt(formData.capacity) || 4,
      amenities: formData.amenities.filter(a => a.trim()),
      activities: formData.activities.filter(a => a.trim()),
      highlights: formData.highlights.filter(h => h.trim()),
      policies: formData.policies.filter(p => p.trim()),
      images: formData.images.filter(i => i.trim()),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: property ? 'Property updated!' : 'Property created!',
          description: 'Your changes have been saved successfully.',
        });
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save property',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrayChange = (field: 'amenities' | 'activities' | 'highlights' | 'policies' | 'images', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'amenities' | 'activities' | 'highlights' | 'policies' | 'images') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'amenities' | 'activities' | 'highlights' | 'policies' | 'images', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-dark border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={onCancel}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                {property ? 'Edit Property' : 'New Property'}
              </span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            {property ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass rounded-2xl border border-border/50 p-6 animate-fade-up">
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-border/30">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="w-[140px] h-9 bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
                <Label htmlFor="is_available">Available</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_top_selling"
                  checked={formData.is_top_selling}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_top_selling: checked })}
                />
                <Label htmlFor="is_top_selling">Top Selling</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-12 bg-secondary/50 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12 bg-secondary/50 rounded-xl">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camping">Camping</SelectItem>
                    <SelectItem value="cottage">Cottage</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="map_link">Google Maps Link *</Label>
                <Input
                  id="map_link"
                  value={formData.map_link}
                  onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
                  className="h-12 bg-secondary/50 rounded-xl"
                  placeholder="Paste Google Maps URL here"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_note">Price Note *</Label>
                <Input
                  id="price_note"
                  value={formData.price_note}
                  onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                  className="h-12 bg-secondary/50 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Max Capacity *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5) *</Label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_in_time">Check-in Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="check_in_time"
                    value={formData.check_in_time}
                    onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_out_time">Check-out Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="check_out_time"
                    value={formData.check_out_time}
                    onChange={(e) => setFormData({ ...formData, check_out_time: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_mobile">Owner Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="owner_mobile"
                    value={formData.owner_mobile}
                    onChange={(e) => setFormData({ ...formData, owner_mobile: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Phone (WhatsApp) *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="h-12 pl-10 bg-secondary/50 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Arrays: Amenities, Activities, Highlights, Policies */}
          {[
            { label: 'Amenities', field: 'amenities' as const, icon: Star },
            { label: 'Activities', field: 'activities' as const, icon: Sparkles },
            { label: 'Highlights', field: 'highlights' as const, icon: Star },
            { label: 'Policies', field: 'policies' as const, icon: Clock },
          ].map((section) => (
            <div key={section.field} className="glass rounded-2xl border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary" />
                {section.label} *
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData[section.field].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayChange(section.field, index, e.target.value)}
                      placeholder={section.label.slice(0, -1)}
                      className="h-12 bg-secondary/50 rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem(section.field, index)}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(section.field)}
                className="mt-3 h-10 rounded-xl border-dashed hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {section.label.slice(0, -1)}
              </Button>
            </div>
          ))}

          {/* Images */}
          <div className="glass rounded-2xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Property Images *
            </h2>
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="flex-1 relative">
                    <Input
                      value={image}
                      onChange={(e) => handleArrayChange('images', index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="h-12 bg-secondary/50 rounded-xl pr-12"
                    />
                    {image && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden bg-secondary">
                        <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('images', index)}
                    className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('images')}
                className="w-full h-12 rounded-xl border-dashed hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Image URL
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl border border-border/50 p-6">
            <Label htmlFor="description" className="text-lg font-semibold mb-6 block">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[150px] bg-secondary/50 rounded-xl resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 animate-fade-up">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-12 px-8 rounded-xl"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-gold-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {property ? 'Update Property' : 'Create Property'}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminPropertyForm;
