const via = <T>(x: T) => {
  const done = <TFout>(f: (input: T) => TFout) => {
    const executionResult = f(x);
    const result = {
      executionResult,
      previous: {
        stepName: f.name || null,
        ...x,
      },
    };
    return result;
  };
  const next = <TFout>(f: (input: T) => TFout) => {
    return via(done(f));
  };
  return {
    done,
    next,
  };
};

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
  .next(function postAddress({ addr }) {
    // call post address
    console.log(addr);
    return {
      address_id: '1234',
    };
  })
  .next(function postRule1({
    executionResult: { address_id },
    previous: { supplier_name },
  }) {
    console.log(address_id);
    console.log(supplier_name);
    const rule_id = 'mock-rule-id';
    const rule_methods = ['m1', 'm2'];
    return {
      rule_id,
      rule_methods,
    };
  })
  .next(function postPostmenConnection(x) {
    console.log(x.executionResult.rule_methods, x.previous.executionResult.address_id);
    const pm_conn = {
      m: x.executionResult.rule_methods[0],
      conn_id: 'id',
    };
    return pm_conn;
  })
  .next(function enableRetailerMethod(x) {
    console.log(x.previous.executionResult.rule_methods[0]);
    return {};
  })
  .next(function disableOtherMethods(x) {
    console.log(x.previous.previous.executionResult.rule_methods[1]);
    return {};
  })
  .next(function postRule2(x) {
    return flow
      .with({})
      .next(function postPmConn() {
        return {
          m2: x.previous.previous.previous.executionResult.rule_methods[1],
        };
      })
      .next(function enableRetailer() {
        console.log(x.previous.previous.previous.executionResult.rule_methods[0]);
        return {};
      })
      .done(function disableOthers(y) {
        console.log(x.previous.previous.previous.executionResult.rule_methods[1]);
        return { success: true };
      });
  })
  .next(function renderRuleId(x) {
    document.querySelector('#app').innerHTML = `<pre>${JSON.stringify(
      x,
      null,
      2
    )}</pre>`;
    return {};
  });
