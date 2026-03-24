'use client';

import { useState, useEffect, useCallback } from 'react';
import { toolsApi, type Tool } from '@/lib/api';

interface UseToolsOptions {
  category?: string;
  search?: string;
  skip?: number;
  take?: number;
}

export function useTools(options: UseToolsOptions = {}) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await toolsApi.getTools(options);
      setTools(response.tools);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tools'));
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.search, options.skip, options.take]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return { tools, total, isLoading, error, refetch: fetchTools };
}

export function useTool(id: string) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchTool = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await toolsApi.getTool(id);
        setTool(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tool'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  return { tool, isLoading, error };
}

export function useHotTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHotTools = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await toolsApi.getHotTools();
        setTools(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch hot tools'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotTools();
  }, []);

  return { tools, isLoading, error };
}
