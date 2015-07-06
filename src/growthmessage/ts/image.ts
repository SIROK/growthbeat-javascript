/// <reference path="events.ts" />

module GrowthMessage {
    export class Image extends GrowthMessage.Events {
        private data:{type:string};
        constructor(){
            super();
        }
        load(config:{}){
            var urls = this.extractImageUrls(config, []);
            var unextracted = urls.length;
            if( !unextracted ){
                this.trigger('load');
                return;
            }
            urls.forEach((url)=>{
                var retriedTimes = 3;
                var img:any = document.createElement('img');
                img.onload = ()=>{
                    if( --unextracted ) return;
                    this.trigger('load');
                };
                img.onerror = ()=>{
                    if( --retriedTimes ){
                        img.src = '';
                        img.src = url;
                    }
                };
                img.src = url;
            });
        }
        private extractImageUrls(input:{}, output):any {
            Object.keys(input).forEach((key)=>{
                if( key==='picture' ){
                    output.push(input[key].url);
                } else if( input[key] instanceof Object ) {
                    output = this.extractImageUrls(input[key], output);
                }
            });
            return output;
        }
    }
}
