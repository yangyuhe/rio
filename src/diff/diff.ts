export function Diff<T>(oldset:T[],newset:T[]){
    let square:SquareUnit[][]=initSquare(oldset,newset);
    findShortest(square,oldset,newset);
    let opers=getOpers(square,oldset,newset);
    return opers;
}

function findShortest<T>(square:SquareUnit[][],oldset:T[],newset:T[]):number{
    let target=square[oldset.length][newset.length];
    if(target.value!=-1)
        return target.value;
    
    let lastnum=0;
    if(oldset[oldset.length-1]==newset[newset.length-1])
        lastnum=0;
    else
        lastnum=1;
    let p1=findShortest(square,oldset.slice(0,oldset.length-1),newset)+1;
    let p2=findShortest(square,oldset,newset.slice(0,newset.length-1))+1;
    let p3=findShortest(square,oldset.slice(0,oldset.length-1),newset.slice(0,newset.length-1))+lastnum;

    let min= Math.min(p1,p2,p3);
    target.value=min;

    if(min==p1){
        target.fromRow=oldset.length-1;
        target.fromColumn=newset.length;
    }else{
        if(min==p2){
            target.fromRow=oldset.length;
            target.fromColumn=newset.length-1;
        }
        else{
            target.fromRow=oldset.length-1;
            target.fromColumn=newset.length-1;
        }
    }


    return target.value;
}
function initSquare<T>(oldset:T[],newset:T[]){
    let square:SquareUnit[][]=[];
    for(let i=0;i<=oldset.length;i++){
        square.push([]);
        for(let j=0;j<=newset.length;j++){
            if(i==0){
                square[i].push({value:j,fromRow:0,fromColumn:j-1});
                continue;
            }
            if(j==0){
                square[i].push({value:i,fromRow:i-1,fromColumn:0});
                continue;
            }
            square[i].push({value:-1,fromRow:-1,fromColumn:-1});
        }
    }
    return square;
}

interface SquareUnit{
    value:number,
    fromRow:number,
    fromColumn:number
}
interface Oper<T>{
    type:"add"|"remove"|"replace",
    newSetIndex?:number,
    oldSetIndex:number
}
function getOpers<T>(square:SquareUnit[][],oldset:T[],newset:T[]){
    let column=newset.length;
    let row=oldset.length;
    
    let opers:Oper<T>[]=[];
    while(true){
        if(row==0 && column==0){
            break;
        }
        let unit=square[row][column];
        if(unit.fromColumn==column-1 && unit.fromRow==row-1){
            if(oldset[row-1]!=newset[column-1]){
                opers.push({type:"replace",newSetIndex:column-1,oldSetIndex:row-1});
            }
            row--;
            column--;
            continue;
        }
        if(unit.fromColumn==column && unit.fromRow==row-1){
            opers.push({type:"remove",oldSetIndex:row-1});
            row--;
            continue;
        }
        if(unit.fromColumn==column-1 && unit.fromRow==row){
            opers.push({type:"add",newSetIndex:column-1,oldSetIndex:row-1});
            column--;
            continue;
        }
        
    }
    return opers;
}

