import{Y as Z,H,I as Q,s as V,r as Y,v as j,u as q,_ as s,D as w,Q as J,w as K,Z as X,a3 as ee,a5 as te,a6 as G,a7 as ae,E as re,a8 as ie}from"./index-ec345350.js";import{p as se}from"./chunk-4BX2VUAB-e100c463.js";import{p as le}from"./mermaid-parser.core-794eb321.js";var W=Z.pie,D={sections:new Map,showData:!1,config:W},g=D.sections,C=D.showData,ne=structuredClone(W),oe=s(()=>structuredClone(ne),"getConfig"),ce=s(()=>{g=new Map,C=D.showData,J()},"clear"),de=s(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);g.has(e)||(g.set(e,a),w.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),pe=s(()=>g,"getSections"),ge=s(e=>{C=e},"setShowData"),ue=s(()=>C,"getShowData"),I={getConfig:oe,clear:ce,setDiagramTitle:H,getDiagramTitle:Q,setAccTitle:V,getAccTitle:Y,setAccDescription:j,getAccDescription:q,addSection:de,getSections:pe,setShowData:ge,getShowData:ue},fe=s((e,a)=>{se(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),he={parse:s(async e=>{const a=await le("pie",e);w.debug(a),fe(a,I)},"parse")},me=s(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),ve=me,Se=s(e=>{const a=[...e.values()].reduce((r,l)=>r+l,0),$=[...e.entries()].map(([r,l])=>({label:r,value:l})).filter(r=>r.value/a*100>=1).sort((r,l)=>l.value-r.value);return ie().value(r=>r.value)($)},"createPieArcs"),xe=s((e,a,$,y)=>{w.debug(`rendering pie chart
`+e);const r=y.db,l=K(),T=X(r.getConfig(),l.pie),A=40,n=18,d=4,o=450,u=o,f=ee(a),c=f.append("g");c.attr("transform","translate("+u/2+","+o/2+")");const{themeVariables:i}=l;let[E]=te(i.pieOuterStrokeWidth);E??(E=2);const _=T.textPosition,p=Math.min(u,o)/2-A,M=G().innerRadius(0).outerRadius(p),O=G().innerRadius(p*_).outerRadius(p*_);c.append("circle").attr("cx",0).attr("cy",0).attr("r",p+E/2).attr("class","pieOuterCircle");const h=r.getSections(),P=Se(h),R=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let m=0;h.forEach(t=>{m+=t});const b=P.filter(t=>(t.data.value/m*100).toFixed(0)!=="0"),v=ae(R);c.selectAll("mySlices").data(b).enter().append("path").attr("d",M).attr("fill",t=>v(t.data.label)).attr("class","pieCircle"),c.selectAll("mySlices").data(b).enter().append("text").text(t=>(t.data.value/m*100).toFixed(0)+"%").attr("transform",t=>"translate("+O.centroid(t)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-(o-50)/2).attr("class","pieTitleText");const k=[...h.entries()].map(([t,x])=>({label:t,value:x})),S=c.selectAll(".legend").data(k).enter().append("g").attr("class","legend").attr("transform",(t,x)=>{const F=n+d,N=F*k.length/2,B=12*n,U=x*F-N;return"translate("+B+","+U+")"});S.append("rect").attr("width",n).attr("height",n).style("fill",t=>v(t.label)).style("stroke",t=>v(t.label)),S.append("text").attr("x",n+d).attr("y",n-d).text(t=>r.getShowData()?`${t.label} [${t.value}]`:t.label);const L=Math.max(...S.selectAll("text").nodes().map(t=>(t==null?void 0:t.getBoundingClientRect().width)??0)),z=u+A+n+d+L;f.attr("viewBox",`0 0 ${z} ${o}`),re(f,o,z,T.useMaxWidth)},"draw"),we={draw:xe},ye={parser:he,db:I,renderer:we,styles:ve};export{ye as diagram};
