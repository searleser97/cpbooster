// time-limit: 2000
problem-url: https://atcoder.jp/contests/abc194/tasks/abc194_f
// 23
#include <bits/stdc++.h>
using namespace std;
#define coutc "\033[48;5;196m\033[38;5;15m"
#define endc "\033[0m"
#define endl '\n'
#define M(_1, _2, _3, _4, NAME, ...) NAME
#define rep(...) \
  M(__VA_ARGS__, rep4, rep3, rep2, rep1)(__VA_ARGS__)
#define rep4(_, x, n, s) \
  for (int _ = x; (s < 0) ? _ > n : _ < n; _ += s)
#define rep3(_, x, n) rep4(_, x, n, (x < n ? 1 : -1))
#define rep2(_, n) rep3(_, 0, n)
#define rep1(n) rep2(i, n)
#define fi first
#define se second
#define pb push_back
#define all(x) (x).begin(), (x).end()
#define allr(x) (x).rbegin(), (x).rend()
#define len(x) int((x).size())
using pii = pair<int, int>; using li = long long int;
using ld = long double; // using lli = __int128_t;
#ifdef DEBUG
string to_string(char c) { return string({c}); }
// 7
template<class... Ts>
ostream& operator<<(ostream& o, tuple<Ts...> t) {
  string s = "(";
  apply([&](auto&&... r) {
    ((s += to_string(r) + ", "), ...); }, t);
  return o << s.substr(0, len(s) - 2) + ")";
}
// 3
ostream& operator<<(ostream &o, pair<auto, auto> p) {
  return o << "(" << p.fi << ", " << p.se << ")";
}
// 7
template<class C, class T = typename C::value_type,
typename std::enable_if<!std::is_same<C, std::string>
::value>::type* = nullptr>
ostream& operator<<(ostream &o, C c) {
  for (auto e : c) o << setw(7) << right << e;
  return o << endc << endl << coutc;
}
// 7
void debug(const auto &e, const auto &... r) {
  cout << coutc << e;
  ((cout << " " << r), ..., (cout << endc << endl));
}
#else
#define debug(...)
#endif
// 3
void _main(int tc) {

}
// 5
int main() {
  ios_base::sync_with_stdio(0), cin.tie(0);
  _main(0), exit(0);
  int tc; cin >> tc; rep(i, tc) _main(i + 1);
}