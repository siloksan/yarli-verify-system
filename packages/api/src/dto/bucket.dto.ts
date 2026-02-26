export interface IBucketCreateDto {
  componentId: string;
  creator: string;
  location?: string;
}

export interface IBucketResponseDto {
  id: string;
  creator: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  component: { name: string; id: string };
}
