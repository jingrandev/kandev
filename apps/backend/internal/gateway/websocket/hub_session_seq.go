package websocket

import "sync/atomic"

func (h *Hub) nextSessionSeq(sessionID string) int64 {
	if sessionID == "" {
		return 0
	}
	value, ok := h.sessionSeqs.Load(sessionID)
	if !ok {
		value, _ = h.sessionSeqs.LoadOrStore(sessionID, &atomic.Int64{})
	}
	return value.(*atomic.Int64).Add(1)
}

func (h *Hub) clearSessionSeq(sessionID string) {
	if sessionID == "" {
		return
	}
	h.sessionSeqs.Delete(sessionID)
}
