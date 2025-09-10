import React, { useState } from 'react';
import { useProjects, useContentCreation, useProfile } from '../hooks/usePortfolio';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Trash2, Edit, Plus, Upload } from 'lucide-react';
import apiService from '../services/api';

// Admin Panel Component - Fixed TypeScript issues

// Type definitions for form data and items
interface ProjectFormData {
  name: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  [key: string]: unknown;
}

interface ContentFormData {
  title: string;
  description: string;
  category: string;
  featured: boolean;
  [key: string]: unknown;
}

interface FileData {
  thumbnail: File | null;
  video: File | null;
  images: File[];
  [key: string]: File | File[] | null;
}

interface ItemData {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies?: string[];
  featured?: boolean;
  thumbnail?: string;
  video?: string;
  images?: string[];
  media?: {
    thumbnail?: string;
    video?: string;
    images?: string[];
  };
  [key: string]: unknown;
}

const AdminPanel = () => {
  const { projects, loading: projectsLoading, createProject, updateProject, deleteProject } = useProjects();
  const { content, loading: contentLoading, createContent, updateContent, deleteContent } = useContentCreation();
  const { profile, loading: profileLoading, updateProfile } = useProfile();

  const [activeTab, setActiveTab] = useState('projects');
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    category: '',
    technologies: [],
    featured: false,
  });

  const [contentFormData, setContentFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    category: '',
    featured: false,
  });

  const [files, setFiles] = useState<FileData>({
    thumbnail: null,
    video: null,
    images: [],
  });

  const handleInputChange = (field: string, value: unknown) => {
    if (activeTab === 'projects') {
      setProjectFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setContentFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileChange = (field: string, fileList: FileList | null) => {
    if (!fileList) return;
    
    if (field === 'images') {
      setFiles(prev => ({
        ...prev,
        [field]: Array.from(fileList),
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [field]: fileList[0],
      }));
    }
  };

  const handleSubmit = async (type: 'project' | 'content') => {
    try {
      const fileData = {};
      Object.entries(files).forEach(([key, value]) => {
        if (value) {
          fileData[key] = Array.isArray(value) ? value : [value];
        }
      });

      if (editingItem) {
        if (type === 'project') {
          await updateProject(editingItem.id, projectFormData, fileData);
        } else {
          await updateContent(editingItem.id, contentFormData, fileData);
        }
      } else {
        if (type === 'project') {
          await createProject(projectFormData, fileData);
        } else {
          await createContent(contentFormData, fileData);
        }
      }

      // Reset form
      if (type === 'project') {
        setProjectFormData({
          name: '',
          description: '',
          category: '',
          technologies: [],
          featured: false,
        });
      } else {
        setContentFormData({
          title: '',
          description: '',
          category: '',
          featured: false,
        });
      }
      setFiles({
        thumbnail: null,
        video: null,
        images: [],
      });
      setEditingItem(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item: ItemData) => {
    setEditingItem(item);
    if (activeTab === 'projects') {
      setProjectFormData({
        name: (item.name as string) || '',
        description: item.description || '',
        category: item.category || '',
        technologies: item.technologies || [],
        featured: item.featured || false,
      });
    } else {
      setContentFormData({
        title: (item.title as string) || '',
        description: item.description || '',
        category: item.category || '',
        featured: item.featured || false,
      });
    }
    setIsCreating(true);
  };

  const handleDelete = async (id: string, type: 'project' | 'content') => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (type === 'project') {
          await deleteProject(id);
        } else {
          await deleteContent(id);
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const renderItemCard = (item: ItemData, type: 'project' | 'content') => (
    <Card key={item.id} className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(item.id, type)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant={item.featured ? 'default' : 'secondary'}>
            {item.featured ? 'Featured' : 'Regular'}
          </Badge>
          <Badge variant="outline">{item.category}</Badge>
        </div>
        {item.technologies && (
          <div className="flex flex-wrap gap-1">
            {item.technologies.map((tech: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
        {item.media && (
          <div className="mt-2 text-sm text-muted-foreground">
            Media: {item.media.thumbnail && 'Thumbnail '}
            {item.media.video && 'Video '}
            {item.media.images?.length > 0 && `${item.media.images.length} Images`}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderForm = (type: 'project' | 'content') => {
    const currentFormData = type === 'project' ? projectFormData : contentFormData;
    const titleField = type === 'project' ? 'name' : 'title';
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {editingItem ? 'Edit' : 'Create'} {type === 'project' ? 'Project' : 'Content'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder={type === 'project' ? 'Project Name' : 'Title'}
            value={currentFormData[titleField] as string}
            onChange={(e) => handleInputChange(titleField, e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={currentFormData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          <Input
            placeholder="Category"
            value={currentFormData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
          />
          
          {type === 'project' && (
            <Input
              placeholder="Technologies (comma-separated)"
              value={(currentFormData as ProjectFormData).technologies.join(', ')}
              onChange={(e) => handleInputChange('technologies', e.target.value.split(', ').filter(Boolean))}
            />
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={currentFormData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
            />
            <label htmlFor="featured">Featured</label>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('thumbnail', e.target.files)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Video</label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange('video', e.target.files)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange('images', e.target.files)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handleSubmit(type)}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreating(false);
              setEditingItem(null);
              if (type === 'project') {
                setProjectFormData({
                  name: '',
                  description: '',
                  category: '',
                  technologies: [],
                  featured: false,
                });
              } else {
                setContentFormData({
                  title: '',
                  description: '',
                  category: '',
                  featured: false,
                });
              }
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
    );
  };

  if (projectsLoading || contentLoading || profileLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="content">Content Creation</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Projects ({projects.length})</h2>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {isCreating && activeTab === 'projects' && renderForm('project')}

          <div className="grid gap-4">
            {projects.map((project) => renderItemCard(project, 'project'))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Content Creation ({content.length})</h2>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>

          {isCreating && activeTab === 'content' && renderForm('content')}

          <div className="grid gap-4">
            {content.map((item) => renderItemCard(item, 'content'))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <strong>Name:</strong> {profile.name}
                  </div>
                  <div>
                    <strong>Title:</strong> {profile.title}
                  </div>
                  <div>
                    <strong>Bio:</strong> {profile.bio}
                  </div>
                  <div>
                    <strong>Email:</strong> {profile.email}
                  </div>
                  <div>
                    <strong>Skills:</strong> {profile.skills?.join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
