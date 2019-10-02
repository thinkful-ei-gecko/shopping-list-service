require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex');

describe('Shopping List Service', () => {
    let db;
    let testItems = [
        {
            id: 1,
            name: 'banana',
            checked: false,
            price: "0.50",
            category: 'Snack',
            date_added: new Date('2120-04-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'fish',
            checked: false,
            price: "12.00",
            category: 'Lunch',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
        },
        {
            id: 3,
            name: 'meat?',
            checked: false,
            price: "99.00",
            category: 'Main',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: 'postgresql://dunder_mifflin:asdf@localhost/knex-practice-test'
        })
    })
    after(() => db.destroy())
    before(() => db('shopping_list').truncate());
    afterEach(() => db('shopping_list').truncate());

    context(`given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })
        it('resolves all items from db', () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        it(`getItemById() resolves an item by id`, () => {
            const testId = 3;
            const testItem = testItems[testId - 1];
            return ShoppingListService.getItemById(db, testId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: testId,
                        name: testItem.name,
                        checked: testItem.checked,
                        price: testItem.price,
                        category: testItem.category,
                        date_added: testItem.date_added,
                    })
                })
        })

        it(`deleteById() remove an item by id`, () => {
            const testId = 3;
            return ShoppingListService.deleteById(db, testId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== testId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an article by id`, () => {
            const testId = 3
            const newItem = {
                name: 'updated item',
                checked: false,
                price: "12.00",
                category: 'Lunch',
                date_added: new Date(),
            }
            return ShoppingListService.updateItem(db, testId, newItem)
                .then(() => ShoppingListService.getItemById(db, testId))
                .then(item => {
                    expect(item).to.eql({ id: testId, ...newItem })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`addItem() inserts an item and resolves it with id`, () => {

            const newItem = {
                name: 'added item',
                checked: false,
                price: "122.00",


                checked: false,
                price: "122.00",
                category: 'Lunch',
                date_added: new Date(),
            }
            return ShoppingListService.addItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        checked: newItem.checked,
                        price: newItem.price,
                        category: newItem.category,
                        date_added: newItem.date_added,
                    })
                })
        })
    })
})
