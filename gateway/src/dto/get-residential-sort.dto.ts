import { IsIn, IsOptional } from 'class-validator';


const sortValues = [ -1, 1 ];

export class GetRentResidentialSortDto {
  @IsOptional()
  @IsIn(sortValues, { message: "'s_url' must be either 1 or -1" })
  s_url?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_publish_date' must be either 1 or -1" })
  s_publish_date?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_source' must be either 1 or -1" })
  s_source?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_city' must be either 1 or -1" })
  s_city?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_district' must be either 1 or -1" })
  s_district?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_price' must be either 1 or -1" })
  s_price?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_online-viewing' must be either 1 or -1" })
  's_online-viewing'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_postal-code' must be either 1 or -1" })
  's_postal-code'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_condition' must be either 1 or -1" })
  s_condition?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_energy-efficiency' must be either 1 or -1" })
  's_energy-efficiency'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_construction-year' must be either 1 or -1" })
  's_construction-year'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_floor' must be either 1 or -1" })
  s_floor?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_parking' must be either 1 or -1" })
  s_parking?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_parking-places' must be either 1 or -1" })
  's_parking-places'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_property-area' must be either 1 or -1" })
  's_property-area'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_furnishing' must be either 1 or -1" })
  s_furnishing?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_bedrooms' must be either 1 or -1" })
  s_bedrooms?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_bathrooms' must be either 1 or -1" })
  s_bathrooms?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_air-conditioning' must be either 1 or -1" })
  's_air-conditioning'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_pets' must be either 1 or -1" })
  s_pets?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_alarm' must be either 1 or -1" })
  s_alarm?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_attic' must be either 1 or -1" })
  s_attic?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_balcony' must be either 1 or -1" })
  s_balcony?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_elevator' must be either 1 or -1" })
  s_elevator?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_fireplace' must be either 1 or -1" })
  s_fireplace?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_garden' must be either 1 or -1" })
  s_garden?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_playroom' must be either 1 or -1" })
  s_playroom?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_pool' must be either 1 or -1" })
  s_pool?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_storage' must be either 1 or -1" })
  s_storage?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_ad_last_updated' must be either 1 or -1" })
  s_ad_last_updated?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_updated_at' must be either 1 or -1" })
  s_updated_at?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_plot-area' must be either 1 or -1" })
  's_plot-area'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_category' must be either 1 or -1" })
  s_category?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_subcategory' must be either 1 or -1" })
  s_subcategory?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_activeDays' must be either 1 or -1" })
  s_activeDays?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_price-sqm' must be either 1 or -1" })
  's_price-sqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_total.medianDelta' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_total.medianDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_total.meanDelta' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_total.meanDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_intermediary.medianDelta' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_intermediary.medianDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_intermediary.meanDelta' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_intermediary.meanDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.daily_total.medianDelta' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.daily_total.medianDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.daily_total.meanDelta' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.daily_total.meanDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.daily_total.medianDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.daily_total.medianDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.city_avg_mean.daily_total.meanDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.city_avg_mean.daily_total.meanDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_total.medianDelta' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_total.medianDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_total.meanDelta' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_total.meanDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_intermediary.medianDelta' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_intermediary.medianDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_intermediary.meanDelta' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_intermediary.meanDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.daily_total.medianDelta' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.daily_total.medianDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.daily_total.meanDelta' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.daily_total.meanDelta'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.daily_total.medianDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.daily_total.medianDeltaSqm'?: number;

  @IsOptional()
  @IsIn(sortValues, { message: "'s_priceDeviations.district_avg_mean.daily_total.meanDeltaSqm' must be either 1 or -1" })
  's_priceDeviations.district_avg_mean.daily_total.meanDeltaSqm'?: number;
}
