const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Event = require('./Event');

const Registration = sequelize.define('Registration', {
  participantName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Relacionamentos (1:N)
Event.hasMany(Registration, { foreignKey: 'eventId', as: 'registrations' });
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = Registration;
