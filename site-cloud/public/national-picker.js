(function () {
  'use strict';
  const original = openRoute;
  openRoute = function (...args) {
    original(...args);
    const data = window.BANHAOLE_NATIONAL_LOCALITIES[active.city];
    if (!data) return;
    const district = document.querySelector('#localDistrict');
    const town = document.querySelector('#localTown');
    if (!district || !town) return;
    const box = district.closest('.local-detail');
    if (district.tagName === 'INPUT') {
      const districts = document.createElement('datalist');
      districts.id = 'nationalDistricts';
      Object.keys(data).forEach(name => districts.append(new Option(name)));
      district.setAttribute('list', districts.id);
      district.placeholder = '选择或输入区县';
      box.append(districts);
    }
    const towns = document.createElement('datalist');
    towns.id = 'nationalTowns';
    town.setAttribute('list', towns.id);
    town.placeholder = '选择或输入街道、镇或乡';
    box.append(towns);
    function refresh() {
      towns.replaceChildren();
      (data[district.value.trim()] || []).forEach(name => towns.append(new Option(name)));
    }
    district.addEventListener('input', refresh);
    district.addEventListener('change', refresh);
    refresh();
    const note = document.createElement('p');
    note.className = 'local-muted';
    note.textContent = '候选名单整理自 2023 年统计用区划数据（截至 2023-06-30），可能已调整，也可能包含统计用特殊区域。可手动填写；请向当地政府核实现行区划、政策和受理窗口。';
    const link = document.createElement('a');
    link.href = 'https://github.com/YangH9/China_area';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'official-link';
    link.textContent = '查看数据来源 ↗';
    note.append(' ', link);
    box.append(note);
  };
})();
