import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Home, 
  Building2, 
  Calendar, 
  Plus,
  Loader2,
  LayoutDashboard,
  TrendingUp,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  ChevronRight,
  MessageSquare,
  Phone,
  Search,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import AdminPropertyForm from '@/components/AdminPropertyForm';
import AdminFloatingActions from '@/components/AdminFloatingActions';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [categorySettings, setCategorySettings] = useState<any[]>([]);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async (token: string) => {
    try {
      const [propRes, settingsRes] = await Promise.all([
        fetch('/api/properties/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/properties/settings/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const propResult = await propRes.json();
      const settingsResult = await settingsRes.json();
      
      if (propResult.success) {
        setProperties(propResult.data || []);
      }
      if (settingsResult.success) {
        setCategorySettings(settingsResult.data || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminUser');
      
      if (!token || !adminData) {
        navigate('/admin/login');
        return;
      }

      setUser(JSON.parse(adminData));
      await fetchData(token);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast({
      title: 'Logged out',
      description: 'You have been signed out successfully.',
    });
    navigate('/admin/login');
  };

  const handleToggleCategory = async (category: string, isClosed: boolean) => {
    let reason = '';
    let closedFrom = '';

    if (!isClosed) {
      const r = window.prompt('Enter Closure Reason:', 'Maintenance');
      if (r === null) return;
      reason = r;
      
      const d = window.prompt('Enter Closure Date/Period (e.g., 10th Jan):', '');
      if (d === null) return;
      closedFrom = d;
    }
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/properties/settings/categories/${category}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_closed: !isClosed,
          closed_reason: reason,
          closed_from: closedFrom,
          closed_to: closedFrom
        })
      });
      const result = await response.json();
      if (result.success) {
        fetchData(token!);
        toast({ title: `Category ${!isClosed ? 'closed' : 'opened'} successfully` });
      }
    } catch (error) {
      toast({ title: 'Failed to update category status', variant: 'destructive' });
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/properties/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: 'Property deleted successfully' });
        fetchData(token!);
      }
    } catch (error) {
      toast({ title: 'Error deleting property', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (id: number, field: string, currentValue: boolean) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/properties/toggle-status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ field, value: !currentValue })
      });
      const result = await response.json();
      if (result.success) {
        fetchData(token!);
        toast({ title: 'Status updated successfully' });
      }
    } catch (error) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const title = p.title || '';
    const location = p.location || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (showPropertyForm) {
    return (
      <AdminPropertyForm
        property={editingProperty}
        onSuccess={() => {
          setShowPropertyForm(false);
          setEditingProperty(null);
          fetchData(localStorage.getItem('adminToken')!);
        }}
        onCancel={() => {
          setShowPropertyForm(false);
          setEditingProperty(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-dark border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-semibold text-foreground">PawnaHavenCamp Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.open('tel:+918806092609')}>
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => window.open('https://wa.me/918806092609')}>
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl border border-border/50 p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Properties</p>
            <p className="text-3xl font-bold text-foreground">{properties.length}</p>
          </div>
          {categorySettings.map(setting => (
            <div key={setting.category} className={`glass rounded-2xl border border-border/50 p-6 ${setting.is_closed ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold capitalize">{setting.category}</p>
                <Button 
                  size="sm" 
                  variant={setting.is_closed ? "default" : "destructive"}
                  className="h-7 rounded-lg text-[10px]"
                  onClick={() => handleToggleCategory(setting.category, setting.is_closed)}
                >
                  {setting.is_closed ? 'Open' : 'Close'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${setting.is_closed ? 'bg-destructive' : 'bg-emerald-500'}`} />
                <span className="text-xs text-muted-foreground">{setting.is_closed ? 'Closed' : 'Active'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Properties Section */}
        <div className="glass rounded-2xl border border-border/50 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Properties Management
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search properties..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-secondary/30"
                />
              </div>
              <Button onClick={() => setShowPropertyForm(true)} className="rounded-xl bg-gradient-to-r from-primary to-gold-dark">
                <Plus className="w-4 h-4 mr-2" />
                New Property
              </Button>
            </div>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="bg-secondary/30 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg px-6">All</TabsTrigger>
              <TabsTrigger value="camping" className="rounded-lg px-6">Camping</TabsTrigger>
              <TabsTrigger value="cottage" className="rounded-lg px-6">Cottage</TabsTrigger>
              <TabsTrigger value="villa" className="rounded-lg px-6">Villa</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {filteredProperties.map((property) => (
              <Dialog key={property.id}>
                <DialogTrigger asChild>
                  <div className="group glass rounded-2xl border border-border/30 p-3 hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        {property.images?.[0] ? (
                          <img src={property.images[0].image_url || property.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Building2 className="w-8 h-8 text-muted-foreground" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate text-sm md:text-lg mb-1">{property.title}</h4>
                        <div className="flex items-center gap-1 text-[10px] md:text-sm text-muted-foreground">
                          <MapPin className="w-2.5 h-2.5" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-primary text-xs md:text-base">₹{property.price}</span>
                          <Badge variant="outline" className="text-[8px] h-5 capitalize">{property.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-display">{property.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 pt-4">
                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 gap-2">
                      {property.images?.map((img: any, idx: number) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-secondary">
                          <img src={img.image_url || img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.location}</span>
                          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {property.rating}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {property.check_in_time} - {property.check_out_time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{property.description}</p>
                        <div className="text-2xl font-bold text-foreground">₹{property.price} <span className="text-sm font-normal text-muted-foreground">{property.price_note}</span></div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Quick Actions</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            className={`h-10 rounded-xl text-xs ${property.is_active ? 'border-emerald-500/50 text-emerald-500' : 'border-destructive/50 text-destructive'}`}
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(property.id, 'is_active', property.is_active); }}
                          >
                            {property.is_active ? 'Active' : 'Inactive'}
                          </Button>
                          <Button 
                            variant="outline" 
                            className={`h-10 rounded-xl text-xs ${property.is_available ? 'border-blue-500/50 text-blue-500' : 'border-orange-500/50 text-orange-500'}`}
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(property.id, 'is_available', property.is_available); }}
                          >
                            {property.is_available ? 'Available' : 'Booked'}
                          </Button>
                          <Button 
                            variant="outline" 
                            className={`h-10 rounded-xl text-xs ${property.is_top_selling ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : ''}`}
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(property.id, 'is_top_selling', property.is_top_selling); }}
                          >
                            Top Selling
                          </Button>
                          <Button variant="outline" className="h-10 rounded-xl text-xs" onClick={() => window.open(`tel:${property.owner_mobile}`)}>
                            Call Owner
                          </Button>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-border/50">
                          <Button variant="outline" className="flex-1 rounded-xl h-10 gap-2" onClick={() => window.open(`/property/${property.slug}`)}>
                            <Eye className="w-4 h-4" /> View Public
                          </Button>
                          <Button variant="outline" className="flex-1 rounded-xl h-10 gap-2 text-primary border-primary/30" onClick={() => { setEditingProperty(property); setShowPropertyForm(true); }}>
                            <Edit3 className="w-4 h-4" /> Edit
                          </Button>
                          <Button variant="outline" className="rounded-xl h-10 w-10 p-0 text-destructive border-destructive/30" onClick={() => handleDeleteProperty(property.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary">
            <Home className="w-4 h-4 mr-2" />
            Back to Website
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
      <AdminFloatingActions />
    </div>
  );
};

export default AdminDashboard;
