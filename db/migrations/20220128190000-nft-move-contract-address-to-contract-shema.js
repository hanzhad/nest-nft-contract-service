'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS chains
        ADD COLUMN IF NOT EXISTS "httpProviderAddress" TEXT NOT NULL DEFAULT 'http://to.change',
        ADD CHECK (
            "httpProviderAddress" ~*
            '^((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=+$,\\w]+@)?[A-Za-z0-9.-]+|(?:www\\.|[-;:&=+$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[+~%/.\\w\\-_]*)?\\??[-+=&;%@.\\w_]*#?[.!/\\\\\\w]*)?)'
          ),
        DROP IF EXISTS slug
    `)
  },

  down: async (queryInterface, Sequelize) => {
  }

};
