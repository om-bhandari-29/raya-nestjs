export class BlueprintListItemDto {
  id: number;
  design_slug: string;
  variant_name: string;
  target_gender: string;
}

export class BlueprintListResponseDto {
  success: boolean;
  count: number;
  data: BlueprintListItemDto[];
}
