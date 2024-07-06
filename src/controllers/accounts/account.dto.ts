import { Expose, Transform } from "class-transformer"
import { IsInt, Max, Min } from "class-validator"

export class AccountSearchQuery {
    @IsInt()
    @Min(10)
    @Max(200)
    @Transform(({ value }) => parseInt(value, 10))
    limit!: number

    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    page!: number

    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    @Expose({ name: 'SearchID'.toLocaleLowerCase() })
    searchId!: number
}