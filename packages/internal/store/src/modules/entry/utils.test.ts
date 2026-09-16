import { afterEach, describe, expect, test, vi } from "vitest"

import { getEffectiveEntrySortOrder, getMarkReadTimeRange, isTimelineEntriesSource } from "./utils"

describe("getEffectiveEntrySortOrder", () => {
  test.each([
    [true, true, "asc"],
    [false, true, "desc"],
    [true, false, "desc"],
    [false, false, "desc"],
  ] as const)(
    "returns %s unread and %s timeline source as %s",
    (unreadOnly, isTimelineSource, expected) => {
      expect(
        getEffectiveEntrySortOrder({
          sortOrder: "asc",
          unreadOnly,
          isTimelineSource,
        }),
      ).toBe(expected)
    },
  )

  test("defaults supported unread timelines to newest first", () => {
    expect(
      getEffectiveEntrySortOrder({
        unreadOnly: true,
        isTimelineSource: true,
      }),
    ).toBe("desc")
  })
})

describe("isTimelineEntriesSource", () => {
  test("supports root, feed, folder, multi-feed, and list timeline sources", () => {
    expect(isTimelineEntriesSource({})).toBe(true)
    expect(isTimelineEntriesSource({ feedId: "feed-1" })).toBe(true)
    expect(isTimelineEntriesSource({ feedId: "folder-news" })).toBe(true)
    expect(isTimelineEntriesSource({ feedId: "feed-1,feed-2" })).toBe(true)
    expect(isTimelineEntriesSource({ feedId: "list-list-1" })).toBe(true)
  })

  test("excludes inbox and collection sources", () => {
    expect(isTimelineEntriesSource({ inboxId: "inbox-1" })).toBe(false)
    expect(isTimelineEntriesSource({ isCollection: true })).toBe(false)
    expect(isTimelineEntriesSource({ feedId: "collections" })).toBe(false)
  })
})

describe("getMarkReadTimeRange", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test.each([
    ["desc", "above", { startTime: 101, endTime: 1_000 }],
    ["desc", "below", { startTime: 1, endTime: 99 }],
    ["asc", "above", { startTime: 1, endTime: 99 }],
    ["asc", "below", { startTime: 101, endTime: 1_000 }],
  ] as const)("uses the %s sort range for entries visually %s", (sortOrder, position, expected) => {
    vi.useFakeTimers()
    vi.setSystemTime(1_000)

    expect(
      getMarkReadTimeRange({
        publishedAt: new Date(100),
        position,
        sortOrder,
      }),
    ).toEqual(expected)
  })
})
