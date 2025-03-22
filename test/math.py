#   test/math.py   

# #################################################################################################
#   
#   
#   Summary: This script is for calculating the math behind screeps to develop efficient methods
#       of gameplay.
# #################################################################################################

# Reinitialize constants after execution state reset
CREEP_LIFETIME = 1500  # ticks
BODY_PART_COST = 50  # energy per part
ENERGY_PER_CARRY = 100  # energy per CARRY part
CARRY_ON_ROAD = 2  # CARRY parts required per 100 energy
MOVE_ON_ROAD = 1  # MOVE part required per 100 energy
CARRY_OFF_ROAD = 2  # CARRY parts required per 100 energy
MOVE_OFF_ROAD = 2  # MOVE parts required per 100 energy

# Energy cost per creep (total cost of body parts)
cost_on_road = (CARRY_ON_ROAD + MOVE_ON_ROAD) * BODY_PART_COST
cost_off_road = (CARRY_OFF_ROAD + MOVE_OFF_ROAD) * BODY_PART_COST

# Energy moved per creep over its lifetime
energy_moved_per_creep = CREEP_LIFETIME * ENERGY_PER_CARRY

# Cost per 100 energy moved
cost_per_100_energy_on_road = cost_on_road / energy_moved_per_creep * 100
cost_per_100_energy_off_road = cost_off_road / energy_moved_per_creep * 100

print (cost_per_100_energy_on_road, cost_per_100_energy_off_road)
