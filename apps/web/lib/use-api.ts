import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface ApiRequestOptions<T> {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  skipToast?: boolean;
}

export function useApi<T = any>(endpoint: string) {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const { toast } = useToast();

  const request = useCallback(
    async (options: ApiRequestOptions<T> = {}) => {
      const {
        method = 'GET',
        body,
        headers = {},
        onSuccess,
        onError,
        skipToast = false,
      } = options;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          credentials: 'include',
          body: body ? JSON.stringify(body) : undefined,
        });

        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
          );
        }

        setState({ data, error: null, loading: false });

        if (onSuccess) {
          onSuccess(data);
        }

        if (!skipToast && method !== 'GET') {
          toast({
            title: 'Success',
            description: data?.message || 'Operation completed successfully',
          });
        }

        return { data, error: null };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';

        console.error(`API Error (${endpoint}):`, error);
        
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));

        if (onError) {
          onError(errorMessage);
        }

        if (!skipToast) {
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }

        return { data: null, error: errorMessage };
      }
    },
    [endpoint, toast]
  );

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    request,
    clearError,
  };
}

// Helper hooks for common HTTP methods
export function useGet<T = any>(endpoint: string) {
  const api = useApi<T>(endpoint);
  const get = useCallback(
    (options?: Omit<ApiRequestOptions<T>, 'method'>) =>
      api.request({ ...options, method: 'GET' }),
    [api]
  );
  return { ...api, get };
}

export function usePost<T = any>(endpoint: string) {
  const api = useApi<T>(endpoint);
  const post = useCallback(
    (options?: Omit<ApiRequestOptions<T>, 'method'>) =>
      api.request({ ...options, method: 'POST' }),
    [api]
  );
  return { ...api, post };
}

export function usePut<T = any>(endpoint: string) {
  const api = useApi<T>(endpoint);
  const put = useCallback(
    (options?: Omit<ApiRequestOptions<T>, 'method'>) =>
      api.request({ ...options, method: 'PUT' }),
    [api]
  );
  return { ...api, put };
}

export function usePatch<T = any>(endpoint: string) {
  const api = useApi<T>(endpoint);
  const patch = useCallback(
    (options?: Omit<ApiRequestOptions<T>, 'method'>) =>
      api.request({ ...options, method: 'PATCH' }),
    [api]
  );
  return { ...api, patch };
}

export function useDelete(endpoint: string) {
  const api = useApi<void>(endpoint);
  const remove = useCallback(
    (options?: Omit<ApiRequestOptions<void>, 'method'>) =>
      api.request({ ...options, method: 'DELETE' }),
    [api]
  );
  return { ...api, remove };
}
