(function(){
'use strict';
const districts=['和平区','河东区','河西区','南开区','河北区','红桥区','东丽区','西青区','津南区','北辰区','武清区','宝坻区','滨海新区','宁河区','静海区','蓟州区'];
const districtsSource='https://www.tj.gov.cn/sq/tjgk/qhyrk/xzqh/202005/t20200522_2615441.html';
const policySource='https://www.tj.gov.cn/zwgk/szfwj/tjsrmzf/202112/t20211231_5768456.html';
const onlineSource='https://www.tj.gov.cn/sy/tjxw/202603/t20260302_7252926.html';
const safeName=value=>/^[\u3400-\u9fffA-Za-z0-9（）()·\-\s]{0,40}$/.test(value);
function node(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x}
function link(url,label){const a=node('a','official-link',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a}
function saveField(input,key){const value=input.value.trim();if(!safeName(value)){input.setCustomValidity('请仅输入地区名称，最多 40 个字符。');input.reportValidity();return}input.setCustomValidity('');active[key]=value;if(saved.some(x=>x.key===active.key))persist()}
function addLocality(){const content=document.querySelector('#routeContent');const section=content.querySelector('.route-section');if(!section)return;const city=active.city;const box=node('section','local-detail');box.append(node('h3','','进一步定位到区县和街道'),node('p','local-muted','填写后可在计划中保存。街道或乡镇名称由你提供，本站尚未核验归属，也不会据此推荐具体窗口。'));
const districtLabel=node('label','','所在区县（选填）');let district;
if(city==='天津市'){district=node('select');district.append(new Option('请选择天津市辖区',''));for(const name of districts)district.append(new Option(name,name));district.value=districts.includes(active.localDistrict)?active.localDistrict:'';districtLabel.append(district);box.append(districtLabel);const source=node('p','local-muted','天津辖区依据天津政务网行政区划页面（2026-03-16），不代表已核验具体受理点。');source.append(' ',link(districtsSource,'查看区划来源 ↗'));box.append(source)}else{district=node('input');district.type='text';district.maxLength=40;district.placeholder='例如：所在区、县或县级市';district.value=active.localDistrict||'';districtLabel.append(district);box.append(districtLabel);box.append(node('p','local-muted','区县名称由你填写，本站尚未核验其所属关系。'))}
district.id='localDistrict';district.addEventListener('change',()=>saveField(district,'localDistrict'));if(district.tagName==='INPUT')district.addEventListener('input',()=>saveField(district,'localDistrict'));
const townLabel=node('label','','街道 / 乡镇（选填）'),town=node('input');town.type='text';town.id='localTown';town.maxLength=40;town.placeholder='例如：所在街道或乡镇';town.value=active.localTown||'';town.addEventListener('input',()=>saveField(town,'localTown'));town.addEventListener('change',()=>saveField(town,'localTown'));townLabel.append(town);box.append(townLabel);section.prepend(box);
if(city==='天津市'&&active.id==='residence'){const expired=Date.now()>=Date.parse('2027-01-01T00:00:00+08:00');const policy=node('section','local-policy');policy.append(node('div','policy-kicker',expired?'已超过标示有效期 · 请重新核验':'市级政策原文 · 已核对来源'),node('h3','','天津市居住证申领要点'),node('p','local-muted','适用范围：天津全市来津公民；港澳台居民等适用另行规定。以下为市级规定摘要，不表示各区、街道存在相同窗口或具体实施细则。'));
if(!expired){const list=node('ul','policy-list');for(const item of ['一般情形：在天津居住满半年，且符合合法稳定住所、合法稳定就业或连续就读条件之一，可申请居住证。','材料方向：本人居民身份证、近期相片，以及居住地住址、就业或就读等证明材料；代办须另核实合法有效证明。','京津冀互认：持相关省市居住证并符合本市条件的，按规定提交相关证件和材料，可不受居住满半年限制；具体适用条件请向公安机关确认。','办理渠道：可向居住地公安派出所、受公安机关委托的社区服务机构或通过网络申请；具体受理点及可办情形请先核实。','费用：首次申领免费；遗失补办或损坏换领需缴纳工本费，具体标准请核实。'])list.append(node('li','',item));policy.append(list)}else policy.append(node('p','policy-expired','原规定标示有效期已结束，本站已停止展示具体条件和费用摘要，请访问官方页面确认最新规定。'));
policy.append(node('p','policy-meta','来源：天津市人民政府，津政规〔2021〕6号；发布 2021-12-31，施行 2022-01-01，原文标示废止日期 2026-12-31；核对日期 2026-10-29。本站不自动监测政策更新。'),link(policySource,'查看政策原文 ↗'),node('p','policy-meta','线上办理参考：天津政务网 2026-03-02 发布的公安民生服务平台消息，具体可办情形以实际平台提示为准。'),link(onlineSource,'查看线上服务来源 ↗'));section.insertBefore(policy,box.nextSibling)}
}
const original=openRoute;openRoute=function(...args){original(...args);addLocality()};
})();
