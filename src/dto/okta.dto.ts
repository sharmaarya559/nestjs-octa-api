import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersDto {
  @ApiProperty({ required: false, minimum: 1, maximum: 200, default: 50 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  filter?: string;
}

export class GetUserDevicesDto {
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  trustedOnly?: boolean = false;
}
