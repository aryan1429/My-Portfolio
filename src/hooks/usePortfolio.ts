import { useState, useEffect } from 'react';
import apiService from '../services/api';

// Type definitions for portfolio data
interface ProjectData {
  name: string;
  description: string;
  category: string;
  technologies: string[];
  featured?: boolean;
  [key: string]: unknown;
}

interface ContentCreationData {
  title: string;
  description: string;
  category: string;
  featured?: boolean;
  [key: string]: unknown;
}

interface ProfileData {
  name: string;
  title: string;
  description: string;
  skills: string[];
  [key: string]: unknown;
}

interface FileUploads {
  [key: string]: File[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (projectData: ProjectData, files?: FileUploads) => {
    try {
      const newProject = await apiService.createProject(projectData, files);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: ProjectData, files?: FileUploads) => {
    try {
      const updatedProject = await apiService.updateProject(id, projectData, files);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await apiService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};

export const useFeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFeaturedProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return { projects, loading, error };
};

export const useContentCreation = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContentCreation();
      setContent(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const createContent = async (contentData: ContentCreationData, files?: FileUploads) => {
    try {
      const newContent = await apiService.createContentCreation(contentData, files);
      setContent(prev => [...prev, newContent]);
      return newContent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateContent = async (id: string, contentData: ContentCreationData, files?: FileUploads) => {
    try {
      const updatedContent = await apiService.updateContentCreation(id, contentData, files);
      setContent(prev => prev.map(c => c.id === id ? updatedContent : c));
      return updatedContent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await apiService.deleteContentCreation(id);
      setContent(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
    createContent,
    updateContent,
    deleteContent,
  };
};

export const useFeaturedContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFeaturedContent();
        setContent(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  return { content, loading, error };
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (profileData: ProfileData, files?: FileUploads) => {
    try {
      const updatedProfile = await apiService.updateProfile(profileData, files);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};

export const useSearch = () => {
  const [results, setResults] = useState({ projects: [], content: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults({ projects: [], content: [] });
      return;
    }

    try {
      setLoading(true);
      const [projectResults, contentResults] = await Promise.all([
        apiService.searchProjects(query),
        apiService.searchContent(query),
      ]);
      
      setResults({
        projects: projectResults,
        content: contentResults,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search,
  };
};
