import json
import r2pipe
import sys
import os

dirname = sys.argv[1]
r = r2pipe.open(os.path.join(dirname, "chall"))
r.cmd("aaa")
graph_json = json.loads(r.cmd("agj sym.foo"))[0]

# print(graph_json)
blocks = graph_json["blocks"]

def filterBlock(block):
    ops = [op["opcode"] for op in block["ops"]]

    return {
        "offset": block["offset"],
        "jump": block["jump"] if "jump" in block.keys() else None,
        "fail": block["fail"] if "fail" in block.keys() else None,
        "ops": ops
    }

blocks = [filterBlock(block) for block in blocks]
for i in range(len(blocks)):
    if blocks[i]["jump"]:
        jump_offset = blocks[i]["jump"]
        blocks[i]["jump"] = next((idx for idx in range(len(blocks)) if blocks[idx]["offset"] == jump_offset), None)
    if blocks[i]["fail"]:
        fail_offset = blocks[i]["fail"]
        blocks[i]["fail"] = next((idx for idx in range(len(blocks)) if blocks[idx]["offset"] == fail_offset), None)

open(os.path.join(dirname, "graph.json"), "w").write(json.dumps(blocks))