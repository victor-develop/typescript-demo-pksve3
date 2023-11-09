const via = <T>(x: T) => ({
  then: <TFout>(f: (input: T) => TFout) => {
    const output = f(x);
    const result = {
      ...output,
      previous: x,
    };
    return via(result);
  },
});

const flow = {
  with: <T>(input: T) => {
    return via(input);
  },
};

flow
  .with({
    addr: '前海嘉里中心',
    supplier_name: 'Apple',
  })
  .then(function postAddress({ addr }) {
    // call post address
    console.log(addr);
    return {
      address_id: '1234',
    };
  })
  .then(function postRule({ address_id, previous: { supplier_name } }) {
    console.log(address_id);
    console.log(supplier_name);
    return { rule_id: 456 };
  })
  .then(function renderRuleId(x) {
    document.querySelector(
      '#app'
    ).innerHTML = `Level 3: ${x.rule_id},<br> Level 2: ${x.previous.address_id} <br> Level 1: ${x.previous.previous.addr}`;
    return {};
  });
