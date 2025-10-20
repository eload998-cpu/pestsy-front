import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import moment from 'moment';

@Injectable()

export class CrudService {
    protected baseUrl: string;
    protected publicUrl: string;

    constructor(
        protected httpClient: HttpClient,
        @Inject('isFactory') protected resourceUrl: any,
    ) {


        this.baseUrl = environment.administrationApiUrl + `/${this.resourceUrl}`;
        this.publicUrl = environment.publicUrl;

    }


    public index$(
        search = '', sort = '', sortBy = '', page = 1, order_id = 0, condition: string | null = null, date_1?: Date | string | null,
        date_2?: Date | string | null
    ) {

        const params = new HttpParams({
            fromObject: {
                search, sort, sortBy,
                page: String(page),
                order_id: String(order_id),
                date_1: this.toUTCISO(date_1 ?? ""),
                date_2: this.toUTCISO(date_2 ?? ""),
                ...(condition != null ? { condition } : {})
            }
        });
        return this.httpClient.get<any>(this.baseUrl, { params });
    }



    public async getSelectData(data: Object) {
        try {


            return await this.httpClient.post<any>(`${this.publicUrl}/resources/get-select-data`, data).toPromise();

        }
        catch (error) {
            throw error;
        }
    }

    async index(
        search = '', sort = '', sortBy = '', page = 1, order_id = 0, condition: string | null = null
    ): Promise<any> {
        return await firstValueFrom(this.index$(search, sort, sortBy, page, order_id, condition));
    }


    public async store(data: FormData | Object): Promise<any> {
        try {
            return await this.httpClient.post<any>(`${this.baseUrl}`, data).toPromise();
        }
        catch (error) {
            throw error;
        }
    }


    public Observableshow(id: number | string): Observable<any> {
        try {
            return this.httpClient.get<any>(`${this.baseUrl}/${id}`);
        }
        catch (error) {
            throw error;
        }
    }

    public async show(id: number | string): Promise<any> {
        try {
            return await this.httpClient.get<any>(`${this.baseUrl}/${id}`).toPromise();
        }
        catch (error) {
            throw error;
        }
    }



    public async update(id: number | string, data: FormData | Object): Promise<any> {
        try {
            return await this.httpClient.post<any>(`${this.baseUrl}/${id}`, data).toPromise();

        }
        catch (error) {
            throw error;
        }
    }

    public async delete(id: number | string): Promise<any> {
        try {
            return await this.httpClient.delete<any>(`${this.baseUrl}/${id}`).toPromise();
        }
        catch (error) {
            throw error;
        }
    }

    private toUTCISO(
        d: Date | string | null | undefined,
        mode: 'datetime' | 'date' | 'startOfDay' | 'endOfDay' = 'datetime'
    ): string | undefined {
        if (!d) return "";
        let m = moment(d);
        if (!m.isValid()) return "";

        if (mode === 'startOfDay') m = m.startOf('day');
        if (mode === 'endOfDay') m = m.endOf('day');

        if (mode === 'date') return m.utc().format('YYYY-MM-DD');
        return m.utc().toISOString(); // ISO with Z
    }

}


