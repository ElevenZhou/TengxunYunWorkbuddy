'use client';

import { useState, useEffect, useCallback } from 'react';
import { workflowsApi, type Workflow } from '@/lib/api';

interface UseWorkflowsOptions {
  category?: string;
  skip?: number;
  take?: number;
}

export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await workflowsApi.getWorkflows(options);
      setWorkflows(response.workflows);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'));
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.skip, options.take]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return { workflows, total, isLoading, error, refetch: fetchWorkflows };
}

export function useWorkflow(id: string) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchWorkflow = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await workflowsApi.getWorkflow(id);
        setWorkflow(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch workflow'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [id]);

  return { workflow, isLoading, error };
}
