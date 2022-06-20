import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsNumber()
  @Min(0)
  milage: number;
}
