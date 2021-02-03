(() => {
  "use strict";
  function function_es6_flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
      case 1:
        return ab;
      case 2:
        return function () {
          return bc(ab.apply(this, arguments));
        };
      case 3:
        return function () {
          return cd(bc(ab.apply(this, arguments)));
        };
      case 4:
        return function () {
          return de(cd(bc(ab.apply(this, arguments))));
        };
      case 5:
        return function () {
          return ef(de(cd(bc(ab.apply(this, arguments)))));
        };
      case 6:
        return function () {
          return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
        };
      case 7:
        return function () {
          return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
        };
      case 8:
        return function () {
          return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
        };
      case 9:
        return function () {
          return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
        };
    }
  }
  function function_es6_pipe(
    a,
    ab,
    bc,
    cd,
    de,
    ef,
    fg,
    gh,
    hi,
    ij,
    jk,
    kl,
    lm,
    mn,
    no,
    op,
    pq,
    qr,
    rs,
    st
  ) {
    switch (arguments.length) {
      case 1:
        return a;
      case 2:
        return ab(a);
      case 3:
        return bc(ab(a));
      case 4:
        return cd(bc(ab(a)));
      case 5:
        return de(cd(bc(ab(a))));
      case 6:
        return ef(de(cd(bc(ab(a)))));
      case 7:
        return fg(ef(de(cd(bc(ab(a))))));
      case 8:
        return gh(fg(ef(de(cd(bc(ab(a)))))));
      case 9:
        return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
      case 10:
        return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
      case 11:
        return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));
      case 12:
        return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
      case 13:
        return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))));
      case 14:
        return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))));
      case 15:
        return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))));
      case 16:
        return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))));
      case 17:
        return pq(
          op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
        );
      case 18:
        return qr(
          pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))
        );
      case 19:
        return rs(
          qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))
        );
      case 20:
        return st(
          rs(
            qr(
              pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))
            )
          )
        );
    }
  }
  const isLeft = (ma) => "Left" === ma._tag,
    left = (e) => ({ _tag: "Left", left: e }),
    right = (a) => ({ _tag: "Right", right: a }),
    swap = (ma) => (isLeft(ma) ? right(ma.left) : left(ma.right)),
    map = (f) => (fa) => (isLeft(fa) ? fa : right(f(fa.right))),
    of = right,
    Functor = { map };
  of([]);
  function EitherT_es6_right(F) {
    return function_es6_flow(right, F.of);
  }
  function EitherT_es6_map(F) {
    return (function (F, G) {
      return (f) => F.map(G.map(f));
    })(F, Functor);
  }
  function EitherT_es6_chain(M) {
    return (f) => M.chain((e) => (isLeft(e) ? M.of(e) : f(e.right)));
  }
  function EitherT_es6_swap(F) {
    return F.map(swap);
  }
  const Task_es6_map = (f) => (fa) => () => fa().then(f),
    Task_es6_of = (a) => () => Promise.resolve(a),
    Task_es6_chain = (f) => (ma) => () => ma().then((a) => f(a)()),
    Task_es6_Functor = { map: Task_es6_map },
    Task_es6_Pointed = { map: Task_es6_map, of: Task_es6_of },
    Task_es6_Monad = {
      map: Task_es6_map,
      of: Task_es6_of,
      chain: Task_es6_chain,
    },
    TaskEither_es6_right =
      (Task_es6_of([]), EitherT_es6_right(Task_es6_Pointed)),
    TaskEither_es6_swap = EitherT_es6_swap(Task_es6_Functor),
    TaskEither_es6_map = EitherT_es6_map(Task_es6_Functor),
    TaskEither_es6_chain = EitherT_es6_chain(Task_es6_Monad),
    TaskEither_es6_of = TaskEither_es6_right;
  TaskEither_es6_of([]);
  function_es6_pipe(
    TaskEither_es6_right(1),
    TaskEither_es6_map(function (n) {
      return n + 1;
    }),
    TaskEither_es6_chain(function (n) {
      return TaskEither_es6_right(n + 1);
    }),
    TaskEither_es6_swap
  );
})();
