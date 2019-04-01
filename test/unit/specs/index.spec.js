import Vue from 'vue'
import index from '@/views/index'

let localVue = createLocalVue();
localVue.use(ElementUI);

describe('index', () => {
  it('h1 should contain 祝英台', () => {
    const Constructor = Vue.extend(index)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent).toContain('祝英台')
  })
})
