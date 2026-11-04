using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Combat;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Executes attack patterns based on weapon configurations.
    /// </summary>
    public static class WeaponAttack
    {
        public static void ExecuteNearestTargetAttack(Transform origin, WeaponLevelStats stats, WeaponModifier modifier, GameObject projectilePrefab, LayerMask targetLayer)
        {
            IDamageable target = WeaponTargeting.GetClosestTarget(origin.position, stats.AreaRadius * modifier.AreaMultiplier, targetLayer);
            Vector2 baseDir = WeaponTargeting.GetDirectionToTarget(origin.position, target, Vector2.right);

            int totalCount = stats.ProjectileCount + modifier.AdditionalProjectiles;
            List<Vector2> directions = WeaponTargeting.ComputeSpreadDirections(baseDir, totalCount, 30f);

            foreach (var dir in directions)
            {
                SpawnSingleProjectile(origin.position, dir, stats, modifier, projectilePrefab, targetLayer);
            }
        }

        public static void ExecuteDirectionalAttack(Transform origin, Vector2 direction, WeaponLevelStats stats, WeaponModifier modifier, GameObject projectilePrefab, LayerMask targetLayer)
        {
            int totalCount = stats.ProjectileCount + modifier.AdditionalProjectiles;
            List<Vector2> directions = WeaponTargeting.ComputeSpreadDirections(direction, totalCount, 25f);

            foreach (var dir in directions)
            {
                SpawnSingleProjectile(origin.position, dir, stats, modifier, projectilePrefab, targetLayer);
            }
        }

        public static void ExecuteAreaOfEffectAttack(Vector2 center, WeaponLevelStats stats, WeaponModifier modifier, LayerMask targetLayer)
        {
            float radius = stats.AreaRadius * modifier.AreaMultiplier;
            float damage = stats.Damage * modifier.DamageMultiplier;

            List<IDamageable> targets = new List<IDamageable>();
            HitDetection.DetectDamageablesInArea(center, radius, targetLayer, targets);

            foreach (var t in targets)
            {
                Vector2 dir = ((Vector2)t.Transform.position - center).normalized;
                t.TakeDamage(damage, dir, stats.KnockbackForce);
            }
        }

        private static void SpawnSingleProjectile(Vector3 position, Vector2 direction, WeaponLevelStats stats, WeaponModifier modifier, GameObject prefab, LayerMask targetLayer)
        {
            if (prefab == null) return;

            GameObject projObj = ProjectileSpawner.SpawnProjectile(prefab, position, Quaternion.identity);
            if (projObj != null && projObj.TryGetComponent<Projectile>(out var projectile))
            {
                float finalDamage = stats.Damage * modifier.DamageMultiplier;
                float finalSpeed = stats.ProjectileSpeed * modifier.SpeedMultiplier;
                int finalPierce = stats.PierceCount + modifier.AdditionalPierce;

                projectile.Initialize(finalDamage, finalSpeed, direction, stats.KnockbackForce, finalPierce, targetLayer);
            }
        }
    }
}

