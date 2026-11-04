using System;
using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Combat
{
    /// <summary>
    /// Utility and component for 2D hit detection using OverlapCircle / Raycast.
    /// Non-allocating queries to avoid GC spikes during heavy horde waves.
    /// </summary>
    public static class HitDetection
    {
        private static readonly Collider2D[] _hitBuffer = new Collider2D[64];

        public static int DetectDamageablesInArea(Vector2 origin, float radius, LayerMask layerMask, List<IDamageable> results)
        {
            results.Clear();
            int hitCount = Physics2D.OverlapCircleNonAlloc(origin, radius, _hitBuffer, layerMask);

            for (int i = 0; i < hitCount; i++)
            {
                if (_hitBuffer[i] != null && _hitBuffer[i].TryGetComponent<IDamageable>(out var damageable))
                {
                    if (damageable.IsAlive && !results.Contains(damageable))
                    {
                        results.Add(damageable);
                    }
                }
            }

            return results.Count;
        }

        public static IDamageable FindClosestDamageable(Vector2 origin, float radius, LayerMask layerMask)
        {
            int hitCount = Physics2D.OverlapCircleNonAlloc(origin, radius, _hitBuffer, layerMask);
            IDamageable closest = null;
            float minDistanceSqr = float.MaxValue;

            for (int i = 0; i < hitCount; i++)
            {
                if (_hitBuffer[i] != null && _hitBuffer[i].TryGetComponent<IDamageable>(out var damageable))
                {
                    if (damageable.IsAlive)
                    {
                        float distSqr = (origin - (Vector2)damageable.Transform.position).sqrMagnitude;
                        if (distSqr < minDistanceSqr)
                        {
                            minDistanceSqr = distSqr;
                            closest = damageable;
                        }
                    }
                }
            }

            return closest;
        }
    }
}

