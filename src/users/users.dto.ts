import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class usersNew{
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsString({message:"El dato debe ser texto"})
    userName: string

    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsString({message:"El dato debe ser texto"})
    email:string

    @IsNotEmpty({message:"No puede quedar vacío"})
    password:string
}

export class updateUser{
    @IsString({message:"El dato debe ser texto"})
    userName?: string

    @IsString({message:"El dato debe ser texto"})
    email?:string

    @IsString({message:"El dato debe ser texto"})
    password?:string
}