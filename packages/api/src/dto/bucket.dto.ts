export interface IBucketCreateDto {
  componentName: string;
  creator: string;
  location?: string;
}

export interface IBucketResponseDto {
  id: string;
  componentName: string;
  creator: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}
