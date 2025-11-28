// dto/param-id.dto.ts
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ParamIdDto {
    @IsNotEmpty({ message: 'ID is required' })
    @IsMongoId({ message: 'Invalid MongoDB ID format' })
    @Transform(({ value }) => value?.trim()) 
    id: string;
}