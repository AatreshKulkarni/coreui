export interface IHwcBlockA {
    category:Array<string>;
    animal:Array<string>;
    park:Array<string>;
    taluk:Array<string>;
    range:Array<string>;
    village:Array<string>;
}

export interface IChartDataset{
    data: Array<any>,
    borderColor: string,
    label: string,
    file: false,
    "fill" : false
}

export interface IBarChartDataSet{
    data: Array<any>,
    borderColor: string,
    backgroundColor:string,// "rgba(0,0,255,0.2)";
    "borderWidth":number,
    label: string,
    file: false,
}

export interface ICategory{
    CATEGORY:string;
    CAT_FREQ:number;
}

export interface IAnimal{
    ANIMAL:string;
    ANIMAL_FREQ:number;
}

export interface IPark{
    PARK:string;
    PARK_FREQ:number;
}

export interface ITaluk{
    TALUK:string;
    TALUK_FREQ:number;
}

export interface IRange{
    HWC_RANGE:string;
    RANGE_FREQ:number;
}

export interface IVillage{
    VILLAGE:string;
    VILLAGE_FREQ:number;
}

export interface IGetblock2TtotalCasesByYearMonth{
    YEAR:number;
    MONTH:string;
    TOTAL_CASES:number;
}

export interface IBblock2Top20CasesByCat{
    HWC_WSID:string;
    HWC_CASE_CATEGORY:string;
    CASES:number;
}
export interface IBblock2Top50CasesByWsid
{
    HWC_WSID: string;
    CASES: number;
}
export interface IBlock3TopCases{
    byCrop:Array<ICrop>;
    byProperty:Array<IProperty>;
    byLiveStock:Array<ILiveStock>;
    byVillage:Array<IVillage_Block3>;
}
export interface ICrop{
    CROP_NAME:string;
    CROP_FREQ:number;
}
export interface IProperty{
    PROPERTY_NAME:string;
    PROPERTY_FREQ:number;
}
export interface ILiveStock{
    LIVESTOCK_NAME:string;
    LIVESTOCK_FREQ:number;
}
export interface IVillage_Block3{
    VILLAGE_NAME:string;
    VILLAGE_FREQ:number;
}