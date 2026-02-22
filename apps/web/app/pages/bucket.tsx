import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import type { IFillingActBucketDto } from '@repo/api';
import { http } from '../shared/lib/http';
//TODO replace with BucketDTO from @repo/api
interface Bucket {
  id: string;
  componentName: string;
  creator: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface Component {
  id: string;
  name: string;
}

const BucketsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [componentName, setComponentName] = useState('');
  const [creator, setCreator] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const {
    data: buckets = [],
    isLoading: bucketsLoading,
    isError: bucketsError,
  } = useQuery<Bucket[]>('buckets', () => http('/api/buckets'));

  const {
    data: components = [],
    isLoading: componentsLoading,
    isError: componentsError,
  } = useQuery<Component[]>('components', () => http('/api/components'));

  // For bucket creation, only a subset of IFillingActBucketDto is used
  type CreateBucketDto = Pick<IFillingActBucketDto, 'componentName'> & {
    creator: string;
    location?: string;
  };

  const createBucketMutation = useMutation(
    (newBucket: CreateBucketDto) =>
      http('/api/buckets', {
        method: 'POST',
        body: newBucket,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('buckets');
        setComponentName('');
        setCreator('');
        setLocation('');
        setError('');
      },
      onError: (err: any) => {
        setError(err.message || 'Failed to create bucket');
      },
    },
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createBucketMutation.mutate({
      componentName,
      creator,
      location: location || undefined,
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Buckets</h1>
      <form onSubmit={handleCreate} style={{ marginBottom: 32 }}>
        <h2>Create New Bucket</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Component Name:</label>
          <select
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            required
            disabled={componentsLoading}
          >
            <option value="">
              {componentsLoading ? 'Loading...' : 'Select component'}
            </option>
            {components.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Creator:</label>
          <input
            type="text"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={createBucketMutation.isLoading || componentsLoading}
        >
          {createBucketMutation.isLoading ? 'Creating...' : 'Create Bucket'}
        </button>
        {(error || createBucketMutation.isError) && (
          <div style={{ color: 'red', marginTop: 8 }}>
            {error || 'Failed to create bucket'}
          </div>
        )}
      </form>
      <h2>All Buckets</h2>
      {bucketsLoading ? (
        <div>Loading buckets...</div>
      ) : bucketsError ? (
        <div style={{ color: 'red' }}>Failed to load buckets</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Component Name</th>
              <th>Creator</th>
              <th>Location</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((bucket) => (
              <tr key={bucket.id}>
                <td>{bucket.componentName}</td>
                <td>{bucket.creator}</td>
                <td>{bucket.location || '-'}</td>
                <td>{new Date(bucket.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BucketsPage;
