/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Controllers/SkillManager.js
   BỘ ĐIỀU KHIỂN TRUNG TÂM QUẢN LÝ 20 NHẪN THUẬT, TIẾN HÓA 6★ & PIXELFX RENDERER
   ============================================================================ */

window.SkillManager = {
    _renderHooked: false,

    // Đồng bộ phân thân
    syncClones(game) {},

    // Tự động thi triển toàn bộ 20 Nhẫn Thuật trong trận
    updateAutoSkills(dt, game) {
        if (!game || !game.player) return;
        const p = game.player;

        // Hook render vào Projectiles một lần duy nhất
        this.ensureRenderHooked();

        // 1. Cập nhật Hệ Hỏa (Fireball, Flamethrower, Meteor, Fire Tornado)
        if (window.FireJutsu) {
            window.FireJutsu.update(dt, game);
        }

        // 2. Cập nhật Hệ Lôi (Chidori, Lightning Strike, Lightning Armor, Plasma Orb)
        if (window.LightningJutsu) {
            window.LightningJutsu.update(dt, game);
        }

        // 3. Cập nhật Hệ Băng & Thủy (Ice Spikes, Icicle Rain, Water Jet, Tidal Wave)
        if (window.IceWaterJutsu) {
            window.IceWaterJutsu.update(dt, game);
        }

        // 4. Cập nhật Thể Thuật, Kiếm Thuật & Vũ Khí (Sword Combo, Dash Strike, Earth Smash, Shuriken)
        if (window.WeaponTaijutsu) {
            window.WeaponTaijutsu.update(dt, game);
        }

        // 5. Cập nhật Bí Thuật Không Gian & Hắc Ám (Bijuu Dama, Teleport Trap, Amaterasu, Force Field)
        if (window.SecretArtsJutsu) {
            window.SecretArtsJutsu.update(dt, game);
        }

        // 6. Cập nhật hiệu ứng trạng thái kẻ địch (Thiêu đốt, Làm chậm, Đóng băng, Choáng)
        this.updateEnemyStatusEffects(dt, game);

        // 7. Cập nhật hồi máu bị động (Regen)
        if (p.hpRegenRate && p.hp < p.maxHp) {
            p.hp = Math.min(p.maxHp, p.hp + p.hpRegenRate * dt);
        }
    },

    // Cập nhật hiệu ứng khống chế & thiêu đốt của kẻ địch
    updateEnemyStatusEffects(dt, game) {
        if (!game.enemies) return;
        for (let i = 0; i < game.enemies.length; i++) {
            const e = game.enemies[i];
            if (e.dead) continue;

            // Thiêu đốt (Burn)
            if (e.burnTimer && e.burnTimer > 0) {
                e.burnTimer -= dt;
                e.burnTick = (e.burnTick || 0) + dt;
                if (e.burnTick >= 0.5) {
                    e.burnTick = 0;
                    window.DamageSystem.damageEnemy(game, e, e.burnDmg || 8, false, 0);
                    if (game.addFloatingText) {
                        game.addFloatingText(e.x, e.y - 12, `🔥 ${e.burnDmg || 8}`, '#f97316', 13);
                    }
                }
            }

            // Đóng băng (Freeze)
            if (e.freezeTimer && e.freezeTimer > 0) {
                e.freezeTimer -= dt;
                e.isFrozen = true;
                e.frozenSpeed = e.speed;
                e.speed = 0; // Đứng bất động
            } else if (e.isFrozen) {
                e.isFrozen = false;
                e.speed = e.frozenSpeed || 80;
            }

            // Làm choáng (Stun)
            if (e.stunTimer && e.stunTimer > 0) {
                e.stunTimer -= dt;
                e.isStunned = true;
                e.stunSpeed = e.speed;
                e.speed = 0;
            } else if (e.isStunned && !e.isFrozen) {
                e.isStunned = false;
                e.speed = e.stunSpeed || 80;
            }

            // Làm chậm (Slow)
            if (e.slowTimer && e.slowTimer > 0 && !e.isFrozen && !e.isStunned) {
                e.slowTimer -= dt;
                if (!e._origSpeed) e._origSpeed = e.speed;
                e.speed = e._origSpeed * (e.slowFactor || 0.5);
            } else if (e._origSpeed && !e.isFrozen && !e.isStunned) {
                e.speed = e._origSpeed;
                delete e._origSpeed;
            }
        }
    },

    // Hook render toàn bộ hiệu ứng 20 Nhẫn Thuật vào pipeline vẽ
    ensureRenderHooked() {
        if (this._renderHooked || !window.Projectiles) return;
        this._renderHooked = true;

        const origRender = window.Projectiles.render.bind(window.Projectiles);
        const self = this;

        window.Projectiles.render = function(ctx, camX, camY, game) {
            origRender(ctx, camX, camY, game);

            // Vẽ toàn bộ hiệu ứng pixel art của 20 Nhẫn Thuật
            try {
                if (window.FireJutsu) window.FireJutsu.render(ctx, camX, camY, game);
                if (window.LightningJutsu) window.LightningJutsu.render(ctx, camX, camY, game);
                if (window.IceWaterJutsu) window.IceWaterJutsu.render(ctx, camX, camY, game);
                if (window.WeaponTaijutsu) window.WeaponTaijutsu.render(ctx, camX, camY, game);
                if (window.SecretArtsJutsu) window.SecretArtsJutsu.render(ctx, camX, camY, game);
            } catch (err) {
                console.warn("[SkillManager]: Lỗi render hiệu ứng nhẫn thuật:", err);
            }
        };

        // Nâng cấp hiển thị 6 Ngôi Sao Vàng trên HUD cho kỹ năng Thức Tỉnh 6★
        this.hookHUDStarDisplay();
    },

    // Hook hiển thị 6 ngôi sao trên thanh HUD khi kỹ năng tiến hóa
    hookHUDStarDisplay() {
        if (!window.HUDView || window.HUDView._starHooked) return;
        window.HUDView._starHooked = true;

        const origRenderActive = window.HUDView._renderActiveSlots ? window.HUDView._renderActiveSlots.bind(window.HUDView) : null;
        if (!origRenderActive) return;

        window.HUDView._renderActiveSlots = function(player) {
            const activeBar = document.getElementById('hudActiveSlotsBar');
            if (!activeBar) return;

            const activeSkills = [];
            const seenActive = new Set();
            if (player.acquiredActive) {
                for (let i = 0; i < player.acquiredActive.length; i++) {
                    const s = window.JutsuCatalog[player.acquiredActive[i]];
                    if (s && s.type === 'active' && !seenActive.has(s.id) && (player.skills[s.id] || 0) > 0) {
                        seenActive.add(s.id);
                        activeSkills.push(s);
                    }
                }
            }
            for (const key of Object.keys(window.JutsuCatalog)) {
                const s = window.JutsuCatalog[key];
                if (s && s.type === 'active' && s.id && !seenActive.has(s.id) && (player.skills[s.id] || 0) > 0) {
                    seenActive.add(s.id);
                    activeSkills.push(s);
                    if (player.acquiredActive && !player.acquiredActive.includes(s.id)) {
                        player.acquiredActive.push(s.id);
                    }
                }
            }

            let html = '';
            for (let i = 0; i < 5; i++) {
                if (i < activeSkills.length) {
                    const s = activeSkills[i];
                    const lv = player.skills[s.id] || 0;
                    const isAwakened = lv >= 6 || player.evolvedSkills?.[s.id];

                    if (isAwakened) {
                        const evo = s.evolution || {};
                        // Hiển thị đầy đủ 6 ngôi sao vàng óng ánh trên thanh HUD
                        const stars6 = [1, 2, 3, 4, 5, 6].map(() => `<span class="slot-star active" style="color: #facc15; text-shadow: 0 0 4px #f59e0b;">★</span>`).join('');
                        html += `
                            <div class="hud-equip-slot slot-active slot-awakened" style="border: 2px solid #facc15; box-shadow: 0 0 10px rgba(250, 204, 21, 0.45);" title="${evo.name || s.name} (🌟 EVOLUTION 6★ MAX)">
                                <span class="hud-slot-icon">${evo.icon || s.icon}</span>
                                <div class="hud-slot-stars" style="display:flex; justify-content:center; gap:1px; transform:scale(0.85);">${stars6}</div>
                                <div class="hud-slot-awakened-badge" style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; font-weight:800; font-size:9px;">6★ EVO</div>
                            </div>
                        `;
                    } else {
                        const stars = [1, 2, 3, 4, 5].map(st => `<span class="slot-star ${st <= lv ? 'active' : ''}">★</span>`).join('');
                        html += `
                            <div class="hud-equip-slot slot-active" title="${s.name} (Cấp ${lv}/5)">
                                <span class="hud-slot-icon">${s.icon}</span>
                                <div class="hud-slot-stars">${stars}</div>
                            </div>
                        `;
                    }
                } else {
                    html += `
                        <div class="hud-equip-slot slot-empty slot-active-empty" title="Ô Nhẫn Thuật Trống (Còn ${5 - activeSkills.length} chỗ)">
                            <span class="hud-slot-plus">+</span>
                        </div>
                    `;
                }
            }
            activeBar.innerHTML = html;
        };
    },

    // Chuyển tiếp lựa chọn nâng cấp / tiến hóa sang SkillEvolution
    selectSkillUpgrade(skillId, isEvolution, game) {
        if (window.SkillEvolution) {
            window.SkillEvolution.selectSkillUpgrade(skillId, isEvolution, game);
        }
    }
};

// Aliases cho tương thích toàn diện
window.SkillSystem = window.SkillManager;
if (window.EvolutionSystem) {
    window.EvolutionSystem.updateAutoSkills = window.SkillManager.updateAutoSkills;
    window.EvolutionSystem.syncClones = window.SkillManager.syncClones;
}
