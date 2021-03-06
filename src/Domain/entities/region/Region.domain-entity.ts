import { Entity, Result, UniqueEntityID } from '../../../Shared';
import { validateStringLengthBetweenMaxAndMin } from '../../utils';
import { MonetaryValueObject } from '../../value-objects';
import { RegionProps } from './Region.domain-entity-interface';
import { ERROR_REGION_DESCRIPTION_LENGTH } from './RegionErrors.domain-entity';
export const REGION_DESCRIPTION_MAX_STRING_LENGTH = 20;
export const REGION_DESCRIPTION_MIN_STRING_LENGTH = 3;

export class Region extends Entity<RegionProps> {
  private constructor(props: RegionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get description(): string {
    return this.props.description;
  }

  get freigthPrice(): MonetaryValueObject {
    return this.props.freigthPrice;
  }

  get isActive(): boolean {
    return this.props.isActive ?? true;
  }

  get geoCode(): number {
    return this.props.geoCode ?? 0;
  }

  deactivate(): void {
    this.props.updatedAt = new Date();
    this.props.isActive = false;
  }

  activate(): void {
    this.props.updatedAt = new Date();
    this.props.isActive = true;
  }

  public static create(
    props: RegionProps,
    id?: UniqueEntityID,
  ): Result<Region> {
    const isValidDescriptionLength = validateStringLengthBetweenMaxAndMin({
      text: props.description,
      maxLength: REGION_DESCRIPTION_MAX_STRING_LENGTH,
      minLength: REGION_DESCRIPTION_MIN_STRING_LENGTH,
    });
    if (!isValidDescriptionLength) {
      return Result.fail<Region>(ERROR_REGION_DESCRIPTION_LENGTH);
    }
    return Result.ok<Region>(new Region(props, id));
  }
}
