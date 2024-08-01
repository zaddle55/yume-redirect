from asyncio import sleep
from bilibili_api import search, sync, settings
from typing import Set, List
import yaml

# 设置代理
# settings.proxy = "https://95.67.205.13:7788"

async def search_by_tag(filter: str) -> Set[str]:
    """
    按标签返回所有视频
    @param filter: 标签
    @return: 视频URL集合
    """
    video_urls: Set[str] = set()
    index: int = 1

    while "result" in (res := await search.search_by_type(
                keyword=filter,
                search_type=search.SearchObjectType.VIDEO,
                order_type=search.OrderVideo.SCORES,
                page=index,
                debug_param_func=print
                )):
        video_urls.update(video["arcurl"] for video in res["result"])
        index += 1
        await sleep(0.2)
    return video_urls


def filter_search(filters: List[str]) -> Set[str]:
    """
    按过滤器列表返回所有视频
    @param filters: 标签列表
    @return: 视频URL集合
    """
    video_urls: Set[str] = set()
    for filter in filters:
        video_urls.update(sync(search_by_tag(filter)))
    return video_urls

# read from target.yaml
with open("./target.yaml", encoding="utf-8") as f:
    targets: List[str] = yaml.safe_load(f)["filter"].copy()

print(filter_search(targets))

# Output to a json
# with open("yume_search.json", "w", encoding="utf-8") as f:
#    json.dump(res, f, ensure_ascii=False, indent=4)