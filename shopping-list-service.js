const shoppingListService = {
    getAllItems(db) {
        return db.select('*').from('shopping_list')
    },

    addItem(db, newItem) {
        return db
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => rows[0])
    },

    getItemById(db, id) {
        return db
            .from('shopping_list')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteById(db, id) {
        return db('shopping_list')
            .where({ id })
            .delete()
    },

    updateItem(db, id, newData) {
        return db('shopping_list')
            .where({ id })
            .update(newData)
    }
}

module.exports = shoppingListService;
