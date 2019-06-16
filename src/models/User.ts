import {
    BeforeCreate,
    BeforeUpdate,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    Model,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import bcrypt from "bcrypt";

@Table({
    timestamps: true,
    tableName: "auth"
})
class User extends Model<User> {
    @Column({
        type: DataType.STRING(256),
        allowNull: false,
        field: 'username',
        unique: true
    })
    userName: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
        field: 'first_name'
    })
    firstName: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
        field: 'last_name'
    })
    lastName: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
        field: 'full_name'
    })
    fullName: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: false,
        field: 'email',
        unique: true
    })
    email: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: false,
        field: 'password'
    })
    password: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
        defaultValue: 'images/blank-profile-picture-640.png',
        field: 'profile_avatar'
    })
    profileAvatar: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: new Date(),
        field: 'last_login'
    })
    lastLogin: string;

    @Column({
        type: DataType.ENUM("0", "1"),
        allowNull: true,
        defaultValue: '0',
        field: 'is_admin'
    })
    isAdmin: string;

    @Column({
        type: DataType.ENUM("0", "1"),
        allowNull: true,
        defaultValue: '1',
        field: 'is_active'
    })
    isActive: string;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @BeforeUpdate
    @BeforeCreate
    static async hashPassword(instance: User) {
        instance.password = await bcrypt.hash(instance.password, 10);
    }

    toJSON() {
        let values = this.get();
        delete values.password;
        return values;
    }
}

export default User;
