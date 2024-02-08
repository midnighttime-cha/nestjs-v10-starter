import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceController } from './geography/controllers/province.controller';
import { ProvinceService } from './geography/services/province.service';
import { DistrictController } from './geography/controllers/district.controller';
import { DistrictService } from './geography/services/district.service';
import { SubDistrictService } from './geography/services/sub-district.service';
import { SubDistrictController } from './geography/controllers/sub-district.controller';
import { GeographyController } from './geography/controllers/geography.controller';
import { GeographyService } from './geography/services/geography.service';
import { GeographyEntities } from './geography/entities/geography.entity';
import { DistrictEntities } from './geography/entities/district.entity';
import { SubDistrictEntities } from './geography/entities/sub-district.entity';
import { ProvinceEntities } from './geography/entities/province.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GeographyEntities,
            ProvinceEntities,
            DistrictEntities,
            SubDistrictEntities,
        ])
    ],
    controllers: [
        ProvinceController,
        DistrictController,
        SubDistrictController,
        GeographyController,
    ],
    providers: [
        ProvinceService,
        DistrictService,
        SubDistrictService,
        GeographyService,
    ]
})
export class MasterDataModule {}
