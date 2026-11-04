using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Combat;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Handles target selection and aiming vector computation for weapons.
    /// </summary>
    public static class WeaponTargeting
    {
        public static IDamageable GetClosestTarget(Vector2 origin, float range, LayerMask targetLayer)
        {
            return HitDetection.FindClosestDamageable(origin, range, targetLayer);
        }

        public static Vector2 GetDirectionToTarget(Vector2 origin, IDamageable target, Vector2 fallbackDirection)
        {
            if (target != null && target.Transform != null)
            {
                return ((Vector2)target.Transform.position - origin).normalized;
            }
            return fallbackDirection.normalized;
        }

        public static List<Vector2> ComputeSpreadDirections(Vector2 baseDirection, int count, float spreadAngleDegrees)
        {
            List<Vector2> directions = new List<Vector2>(count);
            if (count <= 1)
            {
                directions.Add(baseDirection);
                return directions;
            }

            float startAngle = -spreadAngleDegrees * 0.5f;
            float step = spreadAngleDegrees / (count - 1);

            for (int i = 0; i < count; i++)
            {
                float angle = startAngle + (step * i);
                Quaternion rot = Quaternion.Euler(0, 0, angle);
                directions.Add(rot * baseDirection);
            }

            return directions;
        }
    }
}

