import { Result, UniqueEntityID } from '../../../Shared';
import { ImageValueObject, MonetaryValueObject } from '../../value-objects';
import { ItemProps } from './Item.domain-entity-interface';
import { ERROR_ITEM_INVALID_QUANTITY } from './ItemErrors.domain-entity';
import { ItemBasket } from './ItemBasket.domain-entity';
import { Basket, Product } from '../../aggregates-root';
import { BasketCategory } from '../basket-category/BasketCategory.domain-entity';
import { image } from 'faker';
import { ProductCategory } from '../product-category/ProductCategory.domain-entity';
import { ItemId } from './ItemId.domain-entity';
import { Currency } from '../../value-objects/monetary/Currency.value-object';

describe('ItemBasket.domain-entity', () => {
  const makeSut = (
    props?: ItemProps<Basket>,
    id?: UniqueEntityID,
  ): Result<ItemBasket> => {
    return ItemBasket.create(
      {
        item:
          props?.item ??
          Basket.create({
            category: BasketCategory.create({
              changesLimit: 3,
              description: 'Valid Description',
            }).getResult(),
            description: 'Valid Description',
            images: [
              ImageValueObject.create(image.imageUrl().toString()).getResult(),
            ],
            isActive: true,
            price: MonetaryValueObject.create(
              Currency.create({
                locale: 'BR',
                simbol: 'BRL',
                value: 99,
              }).getResult(),
            ).getResult(),
            products: [
              Product.create({
                category: ProductCategory.create({
                  description: 'Valid Category',
                }).getResult(),
                description: 'Valid Description',
                images: [
                  ImageValueObject.create(
                    image.imageUrl().toString(),
                  ).getResult(),
                ],
                isActive: true,
                isSpecial: false,
                price: MonetaryValueObject.create(
                  Currency.create({
                    locale: 'BR',
                    simbol: 'BRL',
                    value: 99,
                  }).getResult(),
                ).getResult(),
                quantityAvaliable: 7,
              }).getResult(),
            ],
          }).getResult(),
        orderId: props?.orderId ?? new UniqueEntityID(),
        quantity: props?.quantity ?? 1,
        total:
          props?.total ??
          MonetaryValueObject.create(
            Currency.create({
              locale: 'BR',
              simbol: 'BRL',
              value: 99,
            }).getResult(),
          ).getResult(),
      },
      id,
    );
  };

  it('Should create a valid ItemBasket', () => {
    const itemCreated = makeSut();
    expect(itemCreated.isFailure).toBe(false);
    expect(itemCreated.getResult().item).toBeDefined();
    expect(itemCreated.getResult().quantity).toBe(1);
    expect(itemCreated.getResult().total.value).toBe(99);
    expect(itemCreated.getResult().orderId).toBeDefined();
  });

  it('Should fail if provide a negative number', () => {
    const props = makeSut().getResult().props;

    const itemCreated = makeSut({
      ...props,
      quantity: -10,
    });
    expect(itemCreated.isFailure).toBe(true);
    expect(itemCreated.error).toBe(ERROR_ITEM_INVALID_QUANTITY);
  });

  it('Should create a valid ItemBasket with provided id', () => {
    const props = makeSut().getResult().props;
    const providedId = ItemId.create().id;
    const itemCreated = makeSut(
      {
        ...props,
      },
      providedId,
    );
    expect(itemCreated.isFailure).toBe(false);
    expect(itemCreated.getResult().id.toString()).toBe(providedId.toString());
  });
});
