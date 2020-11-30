export class ClassBand {
    constructor(
        private id: string,
        private name: string,
        private genre: string,
        private responsible: string
    ) { }

    public getId = (): string => this.id
    public getName = (): string => this.name
    public getGenre = (): string => this.genre
    public getResponsible = (): string => this.responsible

    public setName = (name: string) => this.name = name
    public setGenre = (genre: string) => this.genre = genre
    public setResponsible = (responsible: string) => this.responsible = responsible

    public static toBand(data?: any): ClassBand | undefined {
        return(data && new ClassBand(
            data.id,
            data.name,
            data.genre || data.music_genre,
            data.responsible
        ))
    }
}

export interface Band {
    id: string,
    name: string,
    genre: string,
    responsible: string
}

export interface BandInputDTO {
    name: string;
    genre: string;
    responsible: string;
}