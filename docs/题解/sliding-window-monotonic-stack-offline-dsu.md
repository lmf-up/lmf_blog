# 题解：滑动窗口 + 单调栈 + 离线并查集

## 题意简化

给定数组 `a`，对于任意数组 `b`，定义 `f(b)` 为最少修改多少个元素，才能让 `b` 中存在一个长度至少为 `k` 的连续子数组，使得该子数组连续递增。

也就是说，存在某个位置 `i`，满足：

$$
b_{i+1}=b_i+1,\quad b_{i+2}=b_i+2,\quad \dots
$$

每次查询 `[l,r]`，要求：

$$
\sum_{j=l+k-1}^{r} f([a_l,a_{l+1},\dots,a_j])
$$

困难版本保证所有查询满足：

$$
r\ge l+k-1
$$

---

## 核心转化一：长度为 k 的窗口如何计算

一个长度为 `k` 的连续递增窗口满足：

$$
b_{i+1}=b_i+1
$$

等价于：

$$
b_i-i=\text{constant}
$$

所以对于原数组，定义：

$$
c_i=a_i-i
$$

如果一个长度为 `k` 的窗口 `[s,s+k-1]` 要变成连续递增，那么窗口中所有没有被修改的位置必须有相同的 `c_i`。

因此，窗口中出现次数最多的 `c_i` 可以被保留下来，其余位置需要修改。

设窗口 `[s,s+k-1]` 中某个值的最大出现次数为 `mx`，那么这个窗口的最小修改次数为：

$$
k-mx
$$

定义：

$$
h_s = k - \max_x \operatorname{cnt}(c_i=x),\quad i\in[s,s+k-1]
$$

也就是说，`h_s` 表示第 `s` 个长度为 `k` 的窗口本身变成连续递增段的最小修改次数。

---

## 核心转化二：查询变成前缀最小值之和

考虑查询 `[l,r]`。

对于固定的右端点 `j`，数组 `[a_l,\dots,a_j]` 中可以选择的长度为 `k` 的窗口起点为：

$$
l,l+1,\dots,j-k+1
$$

所以：

$$
f([a_l,\dots,a_j])=\min_{s\in[l,j-k+1]} h_s
$$

令：

$$
R=r-k+1
$$

那么原查询：

$$
\sum_{j=l+k-1}^{r} f([a_l,\dots,a_j])
$$

等价于：

$$
\sum_{x=l}^{R} \min(h_l,h_{l+1},\dots,h_x)
$$

也就是：

> 对数组 `h`，求从 `l` 开始，到 `R` 为止的前缀最小值之和。

---

## 如何求 h 数组

滑动窗口维护：

$$
c_i=a_i-i
$$

对于每个长度为 `k` 的窗口，需要知道窗口内出现次数最多的 `c_i` 的频率。

维护两个数组：

```cpp
cnt[x] = value x appears how many times in current window
bucket[t] = how many values appear exactly t times
```

每次加入或者删除一个元素时，更新 `cnt` 和 `bucket`。

当前最大频率 `mx` 可以通过下面的方式维护：

```cpp
while (mx > 0 && bucket[mx] == 0) {
    mx--;
}
```

于是所有 `h_i` 可以在线性时间内求出。

复杂度：

$$
O(n)
$$

---

## 前缀最小值结构

对数组 `h`，定义：

```cpp
nxt[i] = first position j > i such that h[j] < h[i]
```

如果不存在，则：

```cpp
nxt[i] = N + 1
```

其中：

$$
N=n-k+1
$$

`nxt[i]` 可以用单调栈在线性时间求出。

对于从某个位置 `L` 开始的前缀最小值，它发生变化的位置正好是：

```text
L -> nxt[L] -> nxt[nxt[L]] -> ...
```

例如：

```text
h = 5 4 4 2 3 1
L = 1
```

前缀最小值为：

```text
5 4 4 2 2 1
```

变化点为：

```text
1 -> 2 -> 4 -> 6
```

---

## 预处理贡献 sum

对于每个位置 `i`，从 `i` 到 `nxt[i]-1` 这一段，前缀最小值都等于 `h[i]`。

所以这一段的完整贡献是：

$$
h_i \times (nxt_i-i)
$$

定义：

$$
sum_i = h_i \times (nxt_i-i) + sum_{nxt_i}
$$

表示从 `i` 沿着 `nxt` 一直跳到虚拟根的完整贡献。

因为：

$$
nxt_i > i
$$

所以可以从右往左计算 `sum`。

---

## 查询答案形式

对于查询 `[l,r]`，令：

```cpp
L = l;
R = r - k + 1;
```

我们要找从 `L` 沿着 `nxt` 往上跳时，最后一个不超过 `R` 的点，记为 `cur`。

也就是：

$$
cur\le R<nxt_{cur}
$$

那么答案为：

$$
sum_L - sum_{cur} + h_{cur}\times(R-cur+1)
$$

解释：

- `sum[L] - sum[cur]` 表示 `L` 到 `cur` 之前所有完整段的贡献；
- `cur` 这一段只取到 `R`，所以额外加上：

$$
h_{cur}\times(R-cur+1)
$$

---

## 如何用离线并查集求 cur

我们把 `nxt` 看成一棵树：

```cpp
parent[i] = nxt[i]
```

也就是说，`i` 是 `nxt[i]` 的儿子。

因为：

$$
nxt_i>i
$$

所以父亲编号一定比儿子大。

对于查询 `(L,R)`，我们要找 `L` 到根路径上最后一个不超过 `R` 的祖先。

可以按 `R` 从小到大离线处理。

处理到位置 `i` 时，表示所有编号 `<= i` 的点都已经被激活。

当激活点 `i` 时，把它的所有儿子所在连通块合并到 `i`。

这样对于所有 `R=i` 的查询：

```cpp
cur = find(L)
```

就是 `L` 到根路径上最后一个不超过 `R` 的点。

这个思想和 Tarjan 离线 LCA 很像，都是：

> 离线处理查询，用并查集维护当前已经处理好的祖先关系。

---

## 正确性证明

### 引理 1

长度为 `k` 的窗口 `[s,s+k-1]` 的最小修改次数为：

$$
k-\max_x \operatorname{cnt}(a_i-i=x)
$$

#### 证明

如果一个窗口要变成连续递增，那么所有没有被修改的位置必须满足：

$$
a_i-i=\text{constant}
$$

因此最多只能保留同一个 `a_i-i` 值的所有位置。

若最多有 `mx` 个位置拥有相同的 `a_i-i`，那么可以保留这 `mx` 个位置，修改其他 `k-mx` 个位置。

所以最小修改次数为：

$$
k-mx
$$

证毕。

---

### 引理 2

对于查询 `[l,r]` 中固定的右端点 `j`：

$$
f([a_l,\dots,a_j])=\min_{s\in[l,j-k+1]} h_s
$$

#### 证明

数组 `[a_l,\dots,a_j]` 中只需要存在一个长度至少为 `k` 的连续递增子数组。

如果存在长度大于 `k` 的连续递增子数组，那么它一定包含一个长度正好为 `k` 的连续递增子数组。

所以只需要考虑长度正好为 `k` 的窗口。

这些窗口的起点是：

$$
l,l+1,\dots,j-k+1
$$

每个窗口单独变成连续递增段的最小修改次数是 `h_s`，取最小值即可。

证毕。

---

### 引理 3

查询 `[l,r]` 等价于：

$$
\sum_{x=l}^{r-k+1}\min(h_l,h_{l+1},\dots,h_x)
$$

#### 证明

由引理 2：

$$
f([a_l,\dots,a_j])=\min_{s\in[l,j-k+1]} h_s
$$

令：

$$
x=j-k+1
$$

当：

$$
j=l+k-1,\dots,r
$$

对应：

$$
x=l,\dots,r-k+1
$$

所以原查询变成：

$$
\sum_{x=l}^{r-k+1}\min(h_l,h_{l+1},\dots,h_x)
$$

证毕。

---

### 引理 4

从 `L` 开始不断跳 `nxt`，得到的正好是前缀最小值发生变化的位置。

#### 证明

`nxt[i]` 是右边第一个满足：

$$
h_{nxt_i}<h_i
$$

的位置。

因此在区间：

$$
[i,nxt_i-1]
$$

内，不存在比 `h_i` 更小的值。

所以从 `i` 开始，直到 `nxt[i]-1`，前缀最小值都等于 `h[i]`。

到了 `nxt[i]`，出现了更小的值，前缀最小值发生变化。

所以从 `L` 出发不断跳 `nxt`，正好得到所有前缀最小值变化的位置。

证毕。

---

### 引理 5

离线并查集中，处理到 `R` 时，`find(L)` 等于 `L` 的 `nxt` 链上最后一个不超过 `R` 的点。

#### 证明

因为：

$$
nxt_i>i
$$

所以从 `L` 沿着 `nxt` 往上跳时，编号严格递增：

```text
L -> nxt[L] -> nxt[nxt[L]] -> ...
```

处理到 `R` 时，所有编号 `<=R` 的点已经激活，编号 `>R` 的点尚未激活。

因此 `L` 到根路径上被激活的部分一定是一段连续前缀：

```text
L -> ... -> cur
```

其中：

$$
cur\le R<nxt_{cur}
$$

并查集合并时，总是把已经激活的儿子连通块合并到当前父亲 `i`，因此该连通块的代表元就是当前最高的已激活祖先。

所以：

$$
find(L)=cur
$$

证毕。

---

### 定理

算法输出的答案正确。

#### 证明

由引理 1，可以正确求出每个长度为 `k` 的窗口的最小修改次数 `h_i`。

由引理 2 和引理 3，每个原查询可以转化为数组 `h` 上的前缀最小值之和。

由引理 4，前缀最小值的分段可以由 `nxt` 链表示。

由引理 5，离线并查集可以正确求出查询需要的最后一个位置 `cur`。

最终公式：

$$
sum_L - sum_{cur} + h_{cur}\times(R-cur+1)
$$

正好计算了所有前缀最小值之和。

因此算法正确。

---

## 复杂度分析

滑动窗口求 `h`：

$$
O(n)
$$

单调栈求 `nxt`：

$$
O(n)
$$

离线并查集处理查询：

$$
O((n+q)\alpha(n))
$$

总时间复杂度：

$$
O((n+q)\alpha(n))
$$

空间复杂度：

$$
O(n+q)
$$

其中 $\alpha(n)$ 是反阿克曼函数，可以认为非常接近常数。

---

## 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

using int64 = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int T;
    cin >> T;

    while (T--) {
        int n, k, q;
        cin >> n >> k >> q;

        vector<int> a(n + 1);
        for (int i = 1; i <= n; i++) {
            cin >> a[i];
        }

        int N = n - k + 1;

        vector<int> h(N + 2, 0);

        int offset = n + 5;
        vector<int> cnt(2 * n + 15, 0);
        vector<int> bucket(k + 2, 0);

        int mx = 0;

        auto add_value = [&](int x) {
            int id = x + offset;
            int old = cnt[id];

            if (old > 0) {
                bucket[old]--;
            }

            cnt[id]++;
            bucket[old + 1]++;

            if (old + 1 > mx) {
                mx = old + 1;
            }
        };

        auto remove_value = [&](int x) {
            int id = x + offset;
            int old = cnt[id];

            bucket[old]--;
            cnt[id]--;

            if (old - 1 > 0) {
                bucket[old - 1]++;
            }

            while (mx > 0 && bucket[mx] == 0) {
                mx--;
            }
        };

        for (int i = 1; i <= n; i++) {
            add_value(a[i] - i);

            if (i > k) {
                remove_value(a[i - k] - (i - k));
            }

            if (i >= k) {
                int left = i - k + 1;
                h[left] = k - mx;
            }
        }

        vector<int> nxt(N + 2, N + 1);
        vector<int> st;

        for (int i = N; i >= 1; i--) {
            while (!st.empty() && h[st.back()] >= h[i]) {
                st.pop_back();
            }

            if (!st.empty()) {
                nxt[i] = st.back();
            }

            st.push_back(i);
        }

        nxt[N + 1] = N + 1;

        vector<int64> sum(N + 2, 0);

        for (int i = N; i >= 1; i--) {
            sum[i] = 1LL * h[i] * (nxt[i] - i) + sum[nxt[i]];
        }

        vector<int> head_child(N + 2, -1);
        vector<int> to_child(N + 1);
        vector<int> next_child(N + 1);

        int edge_cnt = 0;

        auto add_edge = [&](int parent, int child) {
            to_child[edge_cnt] = child;
            next_child[edge_cnt] = head_child[parent];
            head_child[parent] = edge_cnt;
            edge_cnt++;
        };

        for (int i = 1; i <= N; i++) {
            add_edge(nxt[i], i);
        }

        vector<int> head_query(N + 2, -1);
        vector<int> query_l(q);
        vector<int> query_id(q);
        vector<int> next_query(q);

        int query_cnt = 0;

        auto add_query = [&](int R, int L, int id) {
            query_l[query_cnt] = L;
            query_id[query_cnt] = id;
            next_query[query_cnt] = head_query[R];
            head_query[R] = query_cnt;
            query_cnt++;
        };

        for (int id = 0; id < q; id++) {
            int l, r;
            cin >> l >> r;

            int L = l;
            int R = r - k + 1;

            add_query(R, L, id);
        }

        vector<int64> ans(q, 0);

        vector<int> dsu(N + 2);
        for (int i = 1; i <= N + 1; i++) {
            dsu[i] = i;
        }

        auto find_root = [&](int x) {
            int root = x;

            while (dsu[root] != root) {
                root = dsu[root];
            }

            while (dsu[x] != x) {
                int parent = dsu[x];
                dsu[x] = root;
                x = parent;
            }

            return root;
        };

        for (int i = 1; i <= N; i++) {
            for (int e = head_child[i]; e != -1; e = next_child[e]) {
                int child = to_child[e];
                int root = find_root(child);
                dsu[root] = i;
            }

            for (int e = head_query[i]; e != -1; e = next_query[e]) {
                int L = query_l[e];
                int id = query_id[e];

                int cur = find_root(L);

                ans[id] = sum[L] - sum[cur] + 1LL * h[cur] * (i - cur + 1);
            }
        }

        for (int i = 0; i < q; i++) {
            cout << ans[i] << '\n';
        }
    }

    return 0;
}
```
