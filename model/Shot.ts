import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Shot extends Model {
  static table = 'shots';

  @field('club') club!: string;
  @field('direction') direction!: string; // legacy
  @field('lateralDirection') lateralDirection!: string;
  @field('inclination') inclination!: string;
  @field('expectation') expectation!: string;
  @field('actual') actual!: string;
  @field('distance') distance!: number;
  @field('carry') carry!: number;
  @field('total') total!: number;
  @field('lie') lie!: string;
  @field('wind') wind!: string;
  @field('notes') notes!: string;
  @field('timestamp') timestamp!: number;
  @field('mode') mode!: string;
  @field('holeNumber') holeNumber!: number;
  @field('par') par!: number;
  @field('score') score!: number;
  @field('pinPosition') pinPosition!: string;
  @field('greenSpeed') greenSpeed!: string;
  @field('practiceType') practiceType!: string;
  @field('targetDistance') targetDistance!: number;
}
