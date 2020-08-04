const message = (sequelize, DataTypes) => {
    const MEssage = sequelize.define('message', {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        }
    });

    Message.associate = models => {
        Message.belongsTo(models.User);
    };

    return Message
}

export default message;