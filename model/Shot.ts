import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Shot extends Model {
  static table = 'shots';

  @field('club') club!: string;
  @field('direction') direction!: string;
  @field('expectation') expectation!: string;
  @field('actual') actual!: string;
  @field('distance') distance!: number;
  @field('timestamp') timestamp!: number;
}
